<script setup lang="ts">
import { onUnmounted, ref, reactive, useTemplateRef, onMounted, computed, h, nextTick } from 'vue'
import { DropdownOption, useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import Timeline from 'wavesurfer.js/plugins/timeline'
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover'
import Minimap from 'wavesurfer.js/dist/plugins/minimap'
import Envelope from 'wavesurfer.js/dist/plugins/envelope'
import Regions, { Region } from 'wavesurfer.js/dist/plugins/regions'
import spectrogram from 'wavesurfer.js/dist/plugins/spectrogram'
import Crunker from 'crunker'
import ControlBtn from './_utils/ControlBtn.vue'
import audiobufferToWav from 'audiobuffer-to-wav'
import { cropAudio, playCroppedAudio, formatTimeToMinutesSecondsMilliseconds, deleteAudioSegments } from './_utils/audio-process'

// import Timeline from '@losting/timeline'
import useStore from '@/store'
import { Subscription, auditTime, fromEvent } from '@tanbo/stream'
type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]

const props = defineProps<{
  fragment: Fragment
}>()

const emits = defineEmits<{
  confirm: [key: string[]]
  cancel: []
}>()

const themeVars = useThemeVars()
const crunker = new Crunker()
const waveEl = useTemplateRef<HTMLElement>('waveEl')
const scrollerEl = useTemplateRef<HTMLDivElement>('scrollerEl')
const timelineEl = useTemplateRef<HTMLCanvasElement>('timelineEl')
const fragment = props.fragment
const inputs = reactive(props.fragment.transcript.map(item => item))

const currentTime = ref(0)
const isPlaying = ref(false)
const subs: Subscription[] = []

// 波形图宽度 (考虑到要显示 transcript, 应该比 transcript 列更长;等于时间轴总宽度)
const waveWidth = fragment.transcript.length * 25 * 2

// 每一秒的宽度（波形图长度）
const secondWidth = waveWidth / fragment.duration

let wavesurfer: WaveSurfer
let regions: Regions
let focuRegion: Region | null = null
let customRegion: Region | null = null
let isRegionSelected = ref(false)
onMounted(() => {
  if (!waveEl.value) return
  wavesurfer = WaveSurfer.create({
    container: waveEl.value,
    waveColor: '#4F4A85',
    progressColor: '#383351',
    width: `${waveWidth}px`,
    url: props.fragment.audio,
    autoScroll: true,
    barAlign: 'bottom',
    dragToSeek: true,
    hideScrollbar: false,
    interact: true
  })
  const timeline = Timeline.create({
    // container: timelineEl.value,
    duration: fragment.duration,
    height: 30,
    timeInterval: 0.1,
    primaryLabelInterval: 10,
    primaryLabelSpacing: 10
  })
  wavesurfer.registerPlugin(timeline)
  const hoverPlugin = HoverPlugin.create({
    formatTimeCallback: function (seconds) {
      return `${formatTimeToMinutesSecondsMilliseconds(seconds)}`
    }
  })
  wavesurfer.registerPlugin(hoverPlugin)
  regions = Regions.create()
  wavesurfer.registerPlugin(regions)
  regions.enableDragSelection({})
  wavesurfer.on('audioprocess', time => {
    // console.log(currentTime)
    currentTime.value = time
  })

  wavesurfer.on('seeking', time => {
    currentTime.value = time
  })

  // customRegion = regions.addRegion({
  //   start: 1,
  //   end: 2,
  //   color: 'rgba(255, 0, 0, 0.3)',
  //   resize: true,
  // })

  // 当用户选择区域后，裁剪音频
  regions.on('region-double-clicked', function (region) {
    // 获取选择区域的起始和结束时间
    var start = region.start
    var end = region.end
    console.log(start, end)
    // playRegion(region)
    // region.play()
    // region.remove()
    // 获取音频的原始缓冲区
    // var originalBuffer = wavesurfer.backend.buffer;
    // var newBuffer = wavesurfer.backend.ac.createBuffer(
    //   originalBuffer.numberOfChannels,
    //   end * originalBuffer.sampleRate - start * originalBuffer.sampleRate,
    //   originalBuffer.sampleRate
    // );

    // // 复制音频数据到新的缓冲区
    // for (var channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
    //   var channelData = originalBuffer.getChannelData(channel);
    //   var newChannelData = newBuffer.getChannelData(channel);
    //   var startIdx = start * originalBuffer.sampleRate;
    //   var endIdx = end * originalBuffer.sampleRate;
    //   for (var i = startIdx, j = 0; i < endIdx; i++, j++) {
    //     newChannelData[j] = channelData[i];
    //   }
    // }

    // 加载裁剪后的音频到wavesurfer
    // wavesurfer.loadDecodedBuffer(newBuffer);
  })
  regions.on('region-created', region => {
    fromEvent<MouseEvent>(region.element, 'contextmenu').subscribe(ev => {
      console.log('region-contextmenu', ev)
      handleContextmenu(ev, region)
    })
    // region.on('over', () => {
    //   // isInsideRegion.value = true
    //   // console.log('region-over', region)
    //   // focuRegion = region
    // })
    // region.on('leave', () => {
    //   // console.log('region-out', region)
    //   // isInsideRegion.value = false
    // })
    // region.on('dblclick', () => {
    //   console.log('region-click', region)
    //   focuRegion = region
    //   isRegionSelected.value = true
    //   region.element.classList.add('selected')
    //   region.element.style.border = '2px solid #add8e6'
    //   region.element.style.boxShadow = '0 0 10px rgba(173, 216, 230, 0.7)'
    // })
    // region.on('click', () => {
    //   console.log('region-click', region)
    //   isRegionSelected.value = false
    //   region.element.classList.remove('selected')
    //   region.element.style.border = 'none'
    //   region.element.style.boxShadow = 'none'
    // })
  })
  regions.on('region-in', region => {
    // console.log('region-in', region)
    if (region.content) {
      // 遮挡时直接跳过
      wavesurfer.skip(region.end - region.start)
    }
  })
  // regions.on('region-out', region => {
  //   console.log('region-out', region)
  //   // wavesurfer.pause()
  // })
  // wavesurfer.on('click', () => {
  //   console.log('wavesurfer click')
  //   isRegionSelected.value = false
  //   showDropdownRef.value = false
  //   if(!focuRegion) return
  //   const region = focuRegion
  //   region.element.classList.remove('selected')
  //   region.element.style.border = 'none'
  //   region.element.style.boxShadow = 'none'
  // })
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

const methods = {
  handlePlayPause() {
    wavesurfer.playPause()
    // customRegion?.play()
    isPlaying.value = wavesurfer.isPlaying()
  },
  async handleCut() {
    if (currentTime.value === 0) return
    const buffer = wavesurfer.getDecodedData()
    if (!buffer) return
    // console.log(currentTime.value, fragment.duration)
    const newbuffer = await cropAudio(buffer, currentTime.value, fragment.duration)
    playCroppedAudio(newbuffer)
    // const newbuffer = await crunker.fetchAudio(fragment.audio).then(buffers => crunker.sliceAudio(buffers[0], currentTime.value, fragment.duration))
    // const wav = audiobufferToWav(newbuffer)
    // const blob = new Blob([wav], { type: 'audio/wav' })
    // crunker.play(newbuffer)
    // wavesurfer.loadBlob(blob)
  },
  handleReplay() {
    wavesurfer.stop()
    wavesurfer.play()
  },
  handleStop() {
    wavesurfer.stop()
  },
  handleCutMany() {
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
  }
}

const focus = ref(-1)
function handleConfirm() {
  // props.onConfirm(inputs)
  emits('confirm', inputs)
}
function handleInput(ev: Event, index: number) {
  const target = ev.target as HTMLInputElement
  target.style.width = 24 + target.value.length * 12 + 'px'
  inputs[index] = target.value ? target.value : ' ' // 不能为空
}
function handleBlur() {
  focus.value = -1
}
function handleFocus(index: number) {
  focus.value = index
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
  subs.forEach(sub => sub.unsubscribe())
})

const options = computed<DropdownOption[]>(() => {
  return [
    {
      label: '播放',
      key: 'play',
      // show: isRegionSelected.value,
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
      label: '取消选区',
      key: 'close',
      icon: () => h(Icon, { icon: 'material-symbols:remove-selection-rounded', height: 24 }),
      props: {
        onClick() {
          console.log('delete', targetRegion)
          targetRegion?.remove()
          targetRegion = null
        }
      }
    },
    {
      label: '删除',
      key: 'delete',
      icon: () => h(Icon, { icon: 'material-symbols:delete-outline', height: 24 }),
      props: {
        onClick() {
          console.log('delete', targetRegion)
          targetRegion?.remove()
          targetRegion = null
        }
      }
    }
  ]
})
const showDropdownRef = ref(false)
let targetRegion: Region | null = null
const xRef = ref(0)
const yRef = ref(0)
function handleContextmenu(ev: MouseEvent, region: Region) {
  ev.preventDefault()
  targetRegion = region
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = ev.clientX
    yRef.value = ev.clientY
  })
}
function handleClickoutside() {
  console.log('clickoutside')
  showDropdownRef.value = false
}
function handleSelect(ev: MouseEvent) {
  showDropdownRef.value = false
}
</script>

<template>
  <div class="fragment-edit">
    <div class="header">
      <div class="duration">
        <span class="current">{{ formatTimeToMinutesSecondsMilliseconds(currentTime) }}</span>
        <span>&nbsp; / &nbsp;</span>
        <span class="total">{{ formatTimeToMinutesSecondsMilliseconds(fragment.duration) }}</span>
      </div>
    </div>
    <div ref="scrollerEl" class="wave-wrapper">
      <div ref="waveEl" class="wave">
        <div class="keyframe" v-for="(item, index) in fragment.timestamps" :key="index" :style="{ left: item * secondWidth + 'px' }">
          <div class="token">
            <input
              v-show="focus === index"
              class="input"
              :value="fragment.transcript[index]"
              @input="handleInput($event, index)"
              @blur="handleBlur"
            />
            <div v-show="focus !== index" class="text" @click.stop="handleFocus(index)">{{ inputs[index] }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="control-item left">
        <span>选区操作：</span>
        <ControlBtn :disabled="!regions?.getRegions().length" @click="methods.handleCutMany" tip="删除所有选区时间段">
          <Icon icon="mdi:box-cutter" height="24" />
        </ControlBtn>
      </div>
      <div class="control-item middle">
        <span>播放操作：</span>
        <div class="btn">
          <Icon icon="icon-park-solid:replay-music" height="24" @click="methods.handleReplay" />
        </div>
        <div class="btn" @click="methods.handlePlayPause">
          <Icon v-if="!isPlaying" icon="material-symbols:play-arrow-rounded" height="24" />
          <Icon v-if="isPlaying" icon="material-symbols:pause-rounded" height="24" />
        </div>
        <div class="btn">
          <Icon icon="material-symbols:stop-rounded" height="24" @click="methods.handleStop" />
        </div>
      </div>
      <div class="control-item right">
        <span>指针操作：</span>
        <ControlBtn tip="从指针位置裁剪" @click="methods.handleCut">
          <Icon icon="material-symbols:content-cut-rounded" height="24" />
        </ControlBtn>
      </div>
    </div>
    <div class="footer"></div>
  </div>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="options"
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .control-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .btn {
    display: flex;
    align-items: center;
    padding: 6px;
    border: 1px solid #3a3a3a;
    cursor: pointer;
    &:hover {
      background-color: #3a3a3a;
    }
    &:active {
      background-color: #1d1d1d;
    }
  }
  .btn {
    margin-left: 12px;
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
.token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1px;
  margin-right: 1px;
}
.input {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 24px;
  height: 23px;
  white-space: nowrap;
  border: none;
  box-sizing: border-box;
  outline: 1px solid v-bind('themeVars.borderColor');
  padding: 0;
  margin: 0;
  box-shadow: none;
  background-color: v-bind('themeVars.inputColor');
  color: v-bind('themeVars.textColor1');
}
.text {
  display: inline-block;
  text-align: center;
  min-width: 24px;
  width: fit-content;
  height: 24px;
  // line-height: 24px;
  background-color: v-bind('themeVars.inputColor');
  cursor: pointer;
}
.text:hover {
  background-color: v-bind('themeVars.buttonColor2Hover');
}
.main {
  display: flex;
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
