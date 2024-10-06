<script setup lang="ts">
import { onUnmounted, ref, reactive, useTemplateRef, onMounted } from 'vue'
import { useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import Timeline from 'wavesurfer.js/plugins/timeline'
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover'
import Minimap from 'wavesurfer.js/dist/plugins/minimap'
import Envelope from 'wavesurfer.js/dist/plugins/envelope'
import Regions from 'wavesurfer.js/dist/plugins/regions'
import spectrogram from 'wavesurfer.js/dist/plugins/spectrogram'


// import Timeline from '@losting/timeline'
import useStore from '@/store'
import { Subscription, fromEvent } from '@tanbo/stream'
type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
  
const props = defineProps<{
  fragment: Fragment
}>()

const emits = defineEmits<{
  confirm: [key: string[]]
  cancel: []
}>()

const themeVars = useThemeVars()
const waveEl = useTemplateRef<HTMLElement>('waveEl')
const scrollerEl = useTemplateRef<HTMLDivElement>('scrollerEl')
const timelineEl = useTemplateRef<HTMLCanvasElement>('timelineEl')
const fragment = props.fragment
const inputs = reactive(props.fragment.transcript.map(item => item))

const isPlaying = ref(false)
const subs: Subscription[] = []

// 波形图宽度 (考虑到要显示 transcript, 应该比 transcript 列更长;等于时间轴总宽度)
const waveWidth = fragment.transcript.length * 25 * 2

// 每一秒的宽度（波形图长度）
const secondWidth = waveWidth / fragment.duration

let wavesurfer: WaveSurfer
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
    interact: true,
  })
  const timeline = Timeline.create({
    // container: timelineEl.value,
    duration: fragment.duration,
    height: 30,
    timeInterval: 0.1,
    primaryLabelInterval: 10,
    primaryLabelSpacing: 10,
  })
  wavesurfer.registerPlugin(timeline)
  const hoverPlugin = HoverPlugin.create()
  wavesurfer.registerPlugin(hoverPlugin)
  const regions = Regions.create()
  wavesurfer.registerPlugin(regions)
  regions.enableDragSelection({})
  wavesurfer.on('audioprocess', (currentTime) => {
    // console.log(currentTime)
  })

  // 当用户选择区域后，裁剪音频
  regions.on('region-double-clicked', function(region) {
    // 获取选择区域的起始和结束时间
    var start = region.start;
    var end = region.end;
    console.log(start, end)
    // playRegion(region)
    region.play()
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
    isPlaying.value = wavesurfer.isPlaying()
  },
  handlePause() {
    wavesurfer.pause()
  },
  handleNextKeyframe() {
    wavesurfer.playPause()
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
  subs.push(fromEvent<WheelEvent>(scrollerEl.value!, 'wheel').subscribe(ev => {
    ev.preventDefault()
    const delta = ev.deltaY
    const scrollLeft = scrollerEl.value!.scrollLeft
    scrollerEl.value!.scrollLeft = scrollLeft + delta
  }))
})
onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
})
</script>

<template>
  <div class="fragment-edit">
    <!-- <div class="duration">{{ fragment.duration }}</div> -->
    <div ref="scrollerEl" class="wave-wrapper">
      <div ref="waveEl" class="wave">
        <div class="keyframe" v-for="(item, index) in fragment.timestamps" :key="index" :style="{ left: item * secondWidth + 'px' }">
          <div class="token">
            <input v-show="focus === index" class="input" :value="fragment.transcript[index]" @input="handleInput($event, index)" @blur="handleBlur" />
            <div v-show="focus !== index" class="text" @click.stop="handleFocus(index)">{{ inputs[index] }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="timeline-wrapper" >
      <canvas ref="timelineEl" />
    </div> -->
    <div class="controls">
      <div class="btn" @click="methods.handlePlayPause">
        <Icon v-if="!isPlaying" icon="material-symbols:play-arrow-rounded" height="24" />
        <Icon v-if="isPlaying" icon="material-symbols:pause-rounded" height="24" />
      </div>
      <!-- <div class="btn" @click="methods.handlePause">
        暂停
      </div>
      <div class="btn" @click="methods.handleNextKeyframe">
        下一帧
      </div> -->
    </div>
    <div class="footer">
      
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bgcolor: #2e2e2e;
.fragment-edit {
  width: 100%;
  overflow: hidden;
  // overflow-x: scroll;
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
    }
  }
}

.controls {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin-left: 12px;
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
  background-color:  v-bind('themeVars.bodyColor');
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
