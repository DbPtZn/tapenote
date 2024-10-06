<script setup lang="ts">
import { onUnmounted, ref, reactive, useTemplateRef, onMounted } from 'vue'
import { useThemeVars } from 'naive-ui'
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import Timeline from 'wavesurfer.js/plugins/timeline'
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover'
import Minimap from 'wavesurfer.js/dist/plugins/minimap'
import Envelope from 'wavesurfer.js/dist/plugins/envelope'
import Regions from 'wavesurfer.js/dist/plugins/regions'
import spectrogram from 'wavesurfer.js/dist/plugins/spectrogram'


// import Timeline from '@losting/timeline'
import useStore from '@/store'
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
const timelineEl = useTemplateRef<HTMLCanvasElement>('timelineEl')
const fragment = props.fragment
const inputs = reactive(props.fragment.transcript.map(item => item))

// 波形图宽度 (考虑到要显示 transcript, 应该比 transcript 列更长;等于时间轴总宽度)
const waveWidth = fragment.transcript.length * 25 * 1.5

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
    url: props.fragment.audio
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
  // const minimap = Minimap.create()
  // wavesurfer.registerPlugin(minimap)
  // const envelope = Envelope.create({})
  // wavesurfer.registerPlugin(envelope)
  // const regions = Regions.create()
  // wavesurfer.registerPlugin(regions)
  // regions.addRegion({
  //   start: 20,
  //   end: 25,
  //   color: '#fff',
  //   drag: true,
  //   resize: true,
  //   content: 'test',
  // })
  // const timeline = new Timeline(timelineEl.value!, {
  //   fill: false,
  //   width: waveWidth,
  //   height: 60,
  // })
  // timeline.draw({
  //   currentTime: Date.now(),
  //   areas: [{
  //     startTime: Date.now(),
  //     endTime: Date.now() + (fragment.duration * 1000),
  //   }]
  // })
})

const methods = {
  handlePlay() {
    wavesurfer.play()
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
onUnmounted(() => {})
</script>

<template>
  <div class="fragment-edit">
    <!-- <div class="duration">{{ fragment.duration }}</div> -->
    <div ref="waveEl" class="wave">
      <div class="keyframe" v-for="(item, index) in fragment.timestamps" :key="index" :style="{ left: item * secondWidth + 'px' }">
        <span>{{ fragment.transcript[index] }}</span>
      </div>
    </div>
    <!-- <div class="timeline-wrapper" >
      <canvas ref="timelineEl" />
    </div> -->
    <div class="content">
      <div class="token" v-for="(item, index) in inputs" :key="index">
        <input v-show="focus === index" class="input" :value="item" @input="handleInput($event, index)" @blur="handleBlur" />
        <div v-show="focus !== index" class="text" @click.stop="handleFocus(index)">{{ inputs[index] }}</div>
      </div>
    </div>
    <div class="footer">
      <div class="controls">
        <div class="btn" @click="methods.handlePlay">
          播放          
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bgcolor: #2e2e2e;
.keyframe {
  position: absolute;
  width: 2px;
  height: 14px;
  background-color: red;
  left: 24px;
  bottom: -14px;
}
.fragment-edit {
  width: 100%;
  overflow-x: scroll;
  .btn {
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
}
.wave {
  position: relative;
  width: fit-content;
  border: 1px dashed #3a3a3a;
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
  .btn {
    margin-left: 12px;
  }
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
