<script lang="ts" setup>
import useStore from '@/store'
import { formatTimeToMinutesSecondsMilliseconds } from '../_utils'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import { Icon } from '@iconify/vue'
import WaveSurfer from 'wavesurfer.js'
import Timeline from 'wavesurfer.js/plugins/timeline'
import { useThemeVars } from 'naive-ui'
import ControlBtn from './_utils/ControlBtn.vue'

type Fragment = ReturnType<typeof useStore>['projectStore']['data'][0]['fragments'][0]
export type PreviewFragment = { audio: Blob } & Pick<Fragment, 'duration' | 'txt' | 'timestamps' | 'promoters' | 'transcript' | 'tags' | 'speaker'>

const props = defineProps<{
  fragments: PreviewFragment[]
}>()

const themeVars = useThemeVars()

const waveEls = useTemplateRef<HTMLDivElement[]>('waveEl')
const scrollerEls = useTemplateRef<HTMLDivElement>('scrollerEl')

let wavesurfers: WaveSurfer[] = []
const currentTime = reactive<number[]>([])
const playerState = reactive<boolean[]>([])

onMounted(() => {
  // console.log(waveEls.value)
  if (!waveEls.value) return
  for (let i = 0; i < props.fragments.length; i++) {
    const fragment = props.fragments[i]
    // console.log(fragment)
    currentTime[i] = 0
    playerState[i] = false
    const waveWidth = fragment.transcript.length * 25 * 2
    // console.log(waveWidth)
    wavesurfers[i] = WaveSurfer.create({
      container: waveEls.value[i],
      waveColor: '#4F4A85',
      progressColor: '#383351',
      width: `${waveWidth}px`,
      autoScroll: true,
      // barAlign: 'bottom',
      normalize: true,
      autoCenter: true,
      dragToSeek: true,
      hideScrollbar: false,
      interact: true
    })
    wavesurfers[i].loadBlob(fragment.audio)
    wavesurfers[i].on('audioprocess', time => {
      currentTime[i] = time
    })
    wavesurfers[i].on('seeking', time => {
      currentTime[i] = time
    })
    wavesurfers[i].on('play', () => {
      playerState[i] = true
    })
    wavesurfers[i].on('pause', () => {
      playerState[i] = false
    })
    wavesurfers[i].on('finish', () => {
      wavesurfers[i].stop()
    })
    // Timeline 时间轴
    const timeline = Timeline.create({
      // container: timelineEl.value,
      duration: fragment.duration,
      height: 30,
      timeInterval: 0.1,
      primaryLabelInterval: 10,
      primaryLabelSpacing: 10
    })
    wavesurfers[i].registerPlugin(timeline)
  }
})


function handlePlayPause(index) {
  wavesurfers[index].playPause()
  // customRegion?.play()
  playerState[index] = wavesurfers[index].isPlaying()
}
</script>

<template>
  <div class="preview">
    <div class="fragment" v-for="(fragment, i) in fragments">
      <div class="header">
        <div class="duration">
          <span class="current">{{ formatTimeToMinutesSecondsMilliseconds(currentTime[i]) }}</span>
          <span>&nbsp; / &nbsp;</span>
          <span class="total">{{ formatTimeToMinutesSecondsMilliseconds(fragment.duration) }}</span>
        </div>
        <div class="actions">
          <div class="btn" @click="handlePlayPause(i)">
            <ControlBtn tip="重播">
              <Icon :icon=" playerState[i] ? 'material-symbols:pause-rounded' :'material-symbols:play-arrow-rounded'" height="24" />
            </ControlBtn>
          </div>
        </div>
      </div>
      <div ref="scrollerEl" class="wave-wrapper">
        <div ref="waveEl" class="wave">
          <div
            class="keyframe"
            v-for="(item, index) in fragment.timestamps"
            :key="index"
            :style="{ left: item * ((fragment.transcript.length * 25 * 2) / fragment.duration) + 'px' }"
          >
            <div class="token">
              <div class="text">{{ fragment.transcript[index] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bgcolor: #2e2e2e;
$hideColor: #575757c7;

.preview {
  width: 100%;
  overflow: hidden;
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

.wave-wrapper {
  overflow-y: hidden;
  overflow-x: auto;
  height: fit-content;
  padding-bottom: 48px;
  .wave {
    position: relative;
    border-bottom: 1px dashed #3a3a3a;
    :deep(.selected) {
      border: 1px solid #fff;
    }
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
    left: -6px;
    bottom: -20px;
  }
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
