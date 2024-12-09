<script setup lang="ts">
import { onUnmounted, ref, reactive, useTemplateRef, onMounted, computed, h, nextTick } from 'vue'
import { DropdownOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import Timeline from 'wavesurfer.js/plugins/timeline'
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover'
// import Minimap from 'wavesurfer.js/dist/plugins/minimap'
// import Envelope from 'wavesurfer.js/dist/plugins/envelope'
import Regions, { Region } from 'wavesurfer.js/dist/plugins/regions'
// import spectrogram from 'wavesurfer.js/dist/plugins/spectrogram'
import Crunker from 'crunker'
import ControlBtn from './_utils/ControlBtn.vue'
import audiobufferToWav from 'audiobuffer-to-wav'
import { cropAudio, splitAudio, playCroppedAudio, deleteAudioSegments } from '../_utils/audio-process'
import FragmentPreview from './FragmentPreview.vue'
import useStore from '@/store'
import { Subscription, auditTime, fromEvent } from '@tanbo/stream'
import { formatTimeToMinutesSecondsMilliseconds } from '../_utils/formatTime'
export type SegmentFragment = {
  audio: Blob
  duration: number
  speaker: {
    type: 'human' | 'machine'
    avatar: string
    name: string
    role: number
  }
  txt: string
  timestamps: number[]
  transcript: string[]
  tags: (string | null)[]
  promoters: (string | null)[]
}
type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
const props = defineProps<{
  fragment: Fragment
}>()

const emits = defineEmits<{
  confirm: [fragments: SegmentFragment[]]
  cancel: []
}>()

const themeVars = useThemeVars()
// const { projectStore } = useStore()
const message = useMessage()
const dialog = useDialog()
// const crunker = new Crunker()
const waveEl = useTemplateRef<HTMLElement>('waveEl')
const scrollerEl = useTemplateRef<HTMLDivElement>('scrollerEl')
const timelineEl = useTemplateRef<HTMLCanvasElement>('timelineEl')
const fragment = props.fragment
const inputs = reactive(props.fragment.transcript.map(item => item))

const currentTime = ref(0)
let currentHoverTime = 0
const isPlaying = ref(false)
const subs: Subscription[] = []

// 波形图宽度 (考虑到要显示 transcript, 应该比 transcript 列更长;等于时间轴总宽度)
const waveWidth = fragment.transcript.length * 25 * 2

// 每一秒的宽度（波形图长度）
const secondWidth = waveWidth / fragment.duration

let wavesurfer: WaveSurfer
let timeline: Timeline
let regions: Regions
let hoverPlugin: HoverPlugin

onMounted(() => {
  if (!waveEl.value) return
  wavesurfer = WaveSurfer.create({
    container: waveEl.value,
    waveColor: '#4F4A85',
    progressColor: '#383351',
    width: `${waveWidth}px`,
    url: props.fragment.audio,
    // autoCenter: true,
    // autoScroll: true,
    // barAlign: 'bottom',
    normalize: true,
    dragToSeek: true,
    hideScrollbar: false,
    interact: true
  })

  subs.push(
    fromEvent<MouseEvent>(waveEl.value, 'contextmenu').subscribe(ev => {
      handleWaveContextmenu(ev)
    })
  )

  // Timeline 时间轴
  timeline = Timeline.create({
    // container: timelineEl.value,
    duration: fragment.duration,
    height: 30,
    timeInterval: 0.1,
    primaryLabelInterval: 10,
    primaryLabelSpacing: 10
  })
  wavesurfer.registerPlugin(timeline)
  // Hover 随鼠标移动的指针
  hoverPlugin = HoverPlugin.create({
    formatTimeCallback: function (seconds) {
      currentHoverTime = seconds
      return `${formatTimeToMinutesSecondsMilliseconds(seconds)}`
    }
  })
  wavesurfer.registerPlugin(hoverPlugin)
  // Region 选区
  regions = Regions.create()
  wavesurfer.registerPlugin(regions)

  wavesurfer.on('audioprocess', time => {
    // console.log(currentTime)
    currentTime.value = time
  })

  wavesurfer.on('seeking', time => {
    currentTime.value = time
  })

  regions.on('region-created', region => {
    const contextmenu = fromEvent<MouseEvent>(region.element, 'contextmenu').subscribe(ev => {
      handleRegionContextmenu(ev, region)
    })
    subs.push(contextmenu)
    region.on('remove', () => {
      contextmenu.unsubscribe()
    })
  })
  regions.on('region-in', region => {
    // console.log('region-in', region)
    if (region.content) {
      // 遮挡时直接跳过
      wavesurfer.skip(region.end - region.start)
    }
  })
  wavesurfer.on('play', () => {
    isPlaying.value = true
  })
  wavesurfer.on('pause', () => {
    isPlaying.value = false
  })
})

function playRegion(region: any) {
  // 获取当前播放时间
  const currentTime = wavesurfer.getCurrentTime()

  // 判断当前播放时间是否在选中区域内
  if (currentTime >= region.start && currentTime <= region.end) {
    // 如果在选中区域内，则暂停播放
    wavesurfer.pause()
  } else {
    // 否则，继续播放
    wavesurfer.play()
  }
}

const enableDragSelection = ref<(() => void) | null>(null)
const methods = {
  // 拖拽选区功能开关
  handleOpenClose() {
    if (enableDragSelection.value) {
      enableDragSelection.value()
      enableDragSelection.value = null
      return
    }
    enableDragSelection.value = regions.enableDragSelection({})
  },
  handlePlayPause() {
    wavesurfer.playPause()
    // customRegion?.play()
    isPlaying.value = wavesurfer.isPlaying()
  },
  handleInsert() {
    regions.addRegion({
      start: currentTime.value,
      color: 'red',
      drag: true
    })
  },
  async handleCut() {
    if (currentTime.value === 0 || currentTime.value >= fragment.duration) {
      message.warning('请选择要裁剪的区域')
      return
    }

    const buffer = wavesurfer.getDecodedData()
    if (!buffer) {
      message.warning('载入音频数据失败')
      return
    }
    const msg = message.loading('正在处理音频，请稍等...', { duration: 0 })
    useSplitFragment(props.fragment, buffer, [currentTime.value], () => {
      msg.destroy()
    })
  },
  async handleCutMany() {
    try {
      const cutRegions = regions.getRegions().filter(region => region.color === 'red')
      if (cutRegions.length === 0) {
        message.warning('找不到分割点')
        return
      }

      const buffer = wavesurfer.getDecodedData()
      if (!buffer) {
        message.warning('载入音频数据失败')
        return
      }

      const splitPoints = cutRegions.map(region => region.start)
      const msg = message.loading('正在处理音频，请稍等...', { duration: 0 })
      useSplitFragment(props.fragment, buffer, splitPoints, () => {
        msg.destroy()
      })
    } catch (error) {
      console.error(error)
    }
  },
  handleReplay() {
    wavesurfer.stop()
    wavesurfer.play()
  },
  handleStop() {
    wavesurfer.stop()
  },
  // 删除选区内容，生成新的音频
  handleDeleteMany() {
    const buffer = wavesurfer.getDecodedData()
    if (!buffer) return
    const cutRegions = regions.getRegions()
    if (cutRegions.length === 0) return
    const segments = cutRegions.map(region => {
      return {
        startTime: region.start,
        endTime: region.end
      }
    })
    deleteAudioSegments(buffer, segments).then(newbuffer => {
      playCroppedAudio(newbuffer)
    })
  },

  handleRegionsClear() {
    regions?.clearRegions()
  }
}

async function useSplitFragment(fragment: Fragment, buffer: AudioBuffer, splitPoints: number[], callback: () => void) {
  try {
    const length = splitPoints.length + 1 // 分片比较于分割点数量多一个，因为最后一个分片包含所有数据
    const txtChunks: string[] = []
    const timestampChunks: number[][] = Array(length).fill([])
    const transcriptChunks: string[][] = Array(length).fill([])
    const tagChunks: (string | null)[][] = Array(length).fill([])
    const promoterChunks: (string | null)[][] = Array(length).fill([])

    const chunks = await splitAudio(buffer, splitPoints, (previousPoint, currentPoint, i) => {
      timestampChunks[i] = []
      transcriptChunks[i] = []
      tagChunks[i] = []
      promoterChunks[i] = []

      fragment.timestamps.forEach((timestamp, index) => {
        if (previousPoint <= timestamp && timestamp <= currentPoint) {
          timestampChunks[i].push(timestamp - previousPoint)
          transcriptChunks[i].push(fragment.transcript[index])
          tagChunks[i].push(fragment.tags[index])
          promoterChunks[i].push(fragment.promoters[index])
        }
      })

      txtChunks[i] = transcriptChunks[i].join('')
    })

    const fragments = chunks.map((audiobuffer, index) => {
      const wav = audiobufferToWav(audiobuffer)
      const blob = new Blob([wav], { type: 'audio/wav' })

      return {
        audio: blob,
        duration: audiobuffer.duration,
        speaker: props.fragment.speaker,
        txt: txtChunks[index],
        timestamps: timestampChunks[index],
        transcript: transcriptChunks[index],
        tags: tagChunks[index],
        promoters: promoterChunks[index]
      }
    })
    // console.log(fragments)
    callback()

    dialog.create({
      showIcon: false,
      style: { width: '800px' },
      maskClosable: false,
      title: '片段裁剪结果',
      content: () => h(FragmentPreview, { fragments }),
      positiveText: '确认',
      negativeText: '放弃',
      onPositiveClick: async () => {
        emits('confirm', fragments)
      },
      onNegativeClick: () => {
        message.info('已放弃')
      }
    })
  } catch (error) {
    callback()
    message.error('分割片段失败')
  }
}


onMounted(() => {
  subs.push(
    fromEvent<WheelEvent>(scrollerEl.value!, 'wheel').subscribe(ev => {
      ev.preventDefault()
      const delta = ev.deltaY
      const scrollLeft = scrollerEl.value!.scrollLeft
      scrollerEl.value!.scrollLeft = scrollLeft + delta
    })
  )
})
onUnmounted(() => {
  wavesurfer.destroy()
  timeline.destroy()
  regions.destroy()
  hoverPlugin.destroy()
  subs.forEach(sub => sub?.unsubscribe())
})

const options = () => {
  return [
    {
      label: '播放',
      key: 'play',
      show: isRegion.value && targetRegion?.color !== 'red',
      icon: () => h(Icon, { icon: 'material-symbols:play-circle-outline', height: 24 }),
      props: {
        onClick() {
          targetRegion?.play()
          const process = () => {
            if (targetRegion && wavesurfer.getCurrentTime() > targetRegion.end) {
              wavesurfer.pause()
              wavesurfer.stop()
              wavesurfer.un('audioprocess', process)
            }
          }
          wavesurfer.on('audioprocess', process)
        }
      }
    },
    {
      label: () => (targetRegion?.content ? '取消遮挡' : '遮挡选区'),
      key: 'hide',
      show: isRegion.value && targetRegion?.color !== 'red',
      icon: () => h(Icon, { icon: targetRegion?.content ? 'ph:selection-slash-duotone' : 'ph:selection-duotone', height: 24 }),
      props: {
        onClick() {
          if (!targetRegion) return
          if (!targetRegion.content) {
            const content = document.createElement('div')
            content.style.display = 'flex'
            content.style.alignItems = 'center'
            content.style.justifyContent = 'center'
            content.style.height = '100%'
            targetRegion.setContent(content)
            targetRegion.setOptions({
              color: '#575757c7',
              start: targetRegion.start,
              end: targetRegion.end
            })
            return
          }
          if (targetRegion.content) {
            targetRegion.setContent(undefined)
            targetRegion.setOptions({
              color: 'rgba(0, 0, 0, 0.1)',
              start: targetRegion.start,
              end: targetRegion.end
            })
          }

          console.log('hide', targetRegion)
        }
      }
    },
    {
      label: () => (targetRegion?.start === targetRegion?.end && targetRegion?.color === 'red' ? '取消分割点' : '取消选区'),
      key: 'close',
      show: isRegion.value,
      icon: () => h(Icon, { icon: 'material-symbols:remove-selection-rounded', height: 24 }),
      props: {
        onClick() {
          console.log('delete', targetRegion)
          targetRegion?.remove()
          // 等待下一次 DOM 更新刷新，因为 dropdown 有个延迟，等它完全关闭再将 targetRegion 置空
          nextTick(() => {
            targetRegion = null
          })
        }
      }
    },
    {
      label: '插入分割点',
      key: 'insert',
      show: targetRegion?.color !== 'red',
      icon: () => h(Icon, { icon: 'fluent:filmstrip-split-24-regular', height: 24 }),
      props: {
        onClick() {
          // console.log(recordHoverTime)
          regions.addRegion({
            start: recordHoverTime,
            color: 'red',
            drag: true
          })
          // console.log('delete', targetRegion)
          // targetRegion?.remove()
          // targetRegion = null
        }
      }
    }
  ]
}
const showDropdownRef = ref(false)
const isRegion = ref(false)
let targetRegion: Region | null = null
let recordHoverTime = 0 // 在右击菜单时记录下当前 hover 指针的位置
const xRef = ref(0)
const yRef = ref(0)
function handleWaveContextmenu(ev: MouseEvent) {
  console.log('wave')
  ev.preventDefault()
  ev.stopPropagation()
  targetRegion = null
  isRegion.value = false
  recordHoverTime = currentHoverTime
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = ev.clientX
    yRef.value = ev.clientY
  })
}
function handleRegionContextmenu(ev: MouseEvent, region: Region) {
  console.log('region')
  ev.preventDefault()
  ev.stopPropagation()
  targetRegion = region
  isRegion.value = true
  recordHoverTime = currentHoverTime
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = ev.clientX
    yRef.value = ev.clientY
  })
}
function handleClickoutside() {
  showDropdownRef.value = false
}
function handleSelect(ev: MouseEvent) {
  showDropdownRef.value = false
}

// const splitPoints = computed(() => regions?.getRegions().filter(region => region.color === 'red'))
</script>

<template>
  <div class="fragment-edit">
    <div class="header">
      <div class="duration">
        <span class="current">{{ formatTimeToMinutesSecondsMilliseconds(currentTime) }}</span>
        <span>&nbsp; / &nbsp;</span>
        <span class="total">{{ formatTimeToMinutesSecondsMilliseconds(fragment.duration) }}</span>
      </div>
      <ControlBtn tip="开启拖拽选区功能">
        <n-switch :value="!!enableDragSelection" @update:value="methods.handleOpenClose" />
      </ControlBtn>
    </div>
    <div ref="scrollerEl" class="wave-wrapper">
      <div ref="waveEl" class="wave">
        <div class="keyframe" v-for="(item, index) in fragment.timestamps" :key="index" :style="{ left: item * secondWidth + 'px' }">
          <div class="token">
            <!-- <input v-show="focus === index" class="input" :value="inputs[index]" @input="handleInput($event, index)" @blur="handleBlur" /> -->
            <div class="text">{{ inputs[index] }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="control-item middle">
        <span>播放操作：</span>
        <div class="btn">
          <ControlBtn tip="重播">
            <Icon icon="icon-park-solid:replay-music" height="24" @click="methods.handleReplay" />
          </ControlBtn>
        </div>
        <div class="btn" @click="methods.handlePlayPause">
          <ControlBtn tip="重播">
            <Icon :icon="isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" height="24" />
          </ControlBtn>
        </div>
        <div class="btn">
          <Icon icon="material-symbols:stop-rounded" height="24" @click="methods.handleStop" />
        </div>
      </div>

      <div class="control-item left">
        <span>选区操作：</span>
        <!-- <div class="btn" @click="methods.handleDeleteMany">
          <ControlBtn :disabled="!regions?.getRegions().length" tip="擦除选区内容">
            <Icon icon="icon-park-twotone:clear-format" height="24" />
          </ControlBtn>
        </div> -->
        <div class="btn" @click="methods.handleRegionsClear">
          <!-- :disabled="!regions?.getRegions().length" -->
          <ControlBtn tip="清理所有选区和分割点">
            <Icon icon="material-symbols:remove-selection-rounded" height="24" />
          </ControlBtn>
        </div>
      </div>

      <div class="control-item right">
        <span>指针操作：</span>
        <div class="btn" @click="methods.handleCut">
          <!-- mdi:box-cutter -->
          <ControlBtn tip="从指针位置裁剪">
            <Icon icon="material-symbols:content-cut-rounded" height="24" />
          </ControlBtn>
        </div>
        <div class="btn" @click="methods.handleInsert">
          <ControlBtn tip="在指针位置插入分割点">
            <Icon icon="fluent:filmstrip-split-24-regular" height="24" />
          </ControlBtn>
        </div>
      </div>

      <div class="control-item">
        <span>综合操作：</span>
        <div class="btn" @click="">
          <ControlBtn tip="擦除首尾静音" :disabled="true">
            <Icon icon="icon-park-outline:clear" height="24" />
          </ControlBtn>
        </div>
        <div class="btn" @click="methods.handleCutMany">
          <ControlBtn tip="根据分割点分割音频">
            <Icon icon="solar:video-frame-cut-2-line-duotone" height="24" />
          </ControlBtn>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="options()"
    :show="showDropdownRef"
    :on-clickoutside="handleClickoutside"
    @select="handleSelect"
  />
</template>

<style lang="scss" scoped>
$bgcolor: #2e2e2e;
$hideColor: #575757c7;
.fragment-edit {
  width: 100%;
  overflow: hidden;
  // overflow-x: scroll;
  .wave-wrapper {
    overflow-y: hidden;
    overflow-x: auto;
    height: fit-content;
    padding-bottom: 48px;
    .wave {
      position: relative;
      // width: fit-content;
      // overflow-y: hidden;
      border-bottom: 1px dashed #3a3a3a;
      :deep(.selected) {
        border: 1px solid #fff;
      }
    }
  }
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0px;
  .duration {
    font-size: 12px;
    .current {
      color: #7272ff;
    }
  }
}

.controls {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: space-between;
  .control-item {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .btn {
    display: flex;
    align-items: center;
    padding: 6px;
    border: 1px solid #3a3a3a;
    margin-left: 12px;
    cursor: pointer;
    &:hover {
      background-color: #3a3a3a;
    }
    &:active {
      background-color: #1d1d1d;
    }
  }
  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.keyframe {
  position: absolute;
  width: 2px;
  height: 14px;
  background-color: red;
  left: 24px;
  bottom: -14px;
  .token {
    position: absolute;
    left: -11px;
    bottom: -25px;
    word-break: normal;
  }
}
.content {
  width: fit-content;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  padding: 24px 0px;
  background-color: $bgcolor;
  // flex-wrap: wrap;
}
// .token {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 1px;
//   margin-right: 1px;
// }
// .input {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   width: 24px;
//   height: 23px;
//   white-space: nowrap;
//   border: none;
//   box-sizing: border-box;
//   outline: 1px solid v-bind('themeVars.borderColor');
//   padding: 0;
//   margin: 0;
//   box-shadow: none;
//   background-color: v-bind('themeVars.inputColor');
//   color: v-bind('themeVars.textColor1');
// }
.text {
  display: inline-block;
  text-align: center;
  min-width: 24px;
  width: fit-content;
  height: 24px;
  // line-height: 24px;
  // background-color: v-bind('themeVars.inputColor');
  // cursor: pointer;
  // &:hover {
  //   background-color: v-bind('themeVars.buttonColor2Hover');
  // }
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 24px;
}

/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: unset;
  background-color: v-bind('themeVars.bodyColor');
}

// /*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 0px;
  background-color: $bgcolor;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: unset;
  background-color: #838383;
}
</style>
