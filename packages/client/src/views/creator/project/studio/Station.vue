<script lang="ts" setup>
import { MessageReactive, SelectOption, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { computed, inject, onUnmounted, ref, useTemplateRef } from 'vue'
import { useDraggable } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import useStore from '@/store'
import { AudioRecorder } from './_utils/recorder'
import { TipBtn } from './private'
import { findLowPoints, formatTimeToMinutesSecondsMilliseconds, splitAudio } from './_utils'
import { useRecorder, useSpeech } from './hooks'
import { Bridge } from '../bridge'
import { Tip } from '../../_common'
import { Subscription, fromEvent } from '@tanbo/stream'
type Action = Required<Parameters<ReturnType<ReturnType<typeof useStore>['projectStore']['fragment']>['createByAudio']>[0]['actions']>[0]
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
  account: string
  hostname: string
  speakerId?: string
}>()

const emits = defineEmits<{
  start: []
  end: []
  output: []
}>()

const themeVars = useThemeVars()
const message = useMessage()
const dialog = useDialog()
const { projectStore } = useStore()

// const isStartedRecorder = ref(false)
const stationEl = useTemplateRef<HTMLElement>('stationEl')
const handleEl = useTemplateRef<HTMLElement>('handleEl')
const isShowStationToolbar = ref(true)
const isRow = ref(true)

const { x, y } = useDraggable(stationEl, {
  initialValue: { x: 0, y: 90 },
  containerElement: bridge.projectRef,
  stopPropagation: true, // 阻止冒泡
  preventDefault: true,
  handle: handleEl
})

const offsetX = computed(() => {
  const rootRect = bridge.scrollerEl.value?.getBoundingClientRect()
  const left = rootRect?.width || 0
  return x.value - left
})
const offsetY = computed(() => {
  return y.value - 42
})

const {
  waveEl,
  isRecording,
  totalDuration,
  isWaveformVisible,
  isStarted,
  isAutoCut,
  onStateUpdate,
  onRecorderEnd,
  ondataavailable,
  getCurrentDuration,
  handleOperate,
  handleStartPause,
  handleStopRecord,
  handleCut,
  handleWaveformVisible
} = useRecorder({ silenceSpace: 3000 })
const { mode, options, startSpeech, stopSpeech, getActionSequence } = useSpeech(bridge, getCurrentDuration, handleOperate)

const isWaitForSelectAnime = ref(false)
const shortcut: Subscription[] = []
let msg: MessageReactive | undefined = undefined
let isCancel = false
const speechMethods = {
  start: () => {
    if (!isStarted.value) {
      // isStartedRecorder.value = true
      emits('start')
      if (isWaitForSelectAnime.value) {
        isWaitForSelectAnime.value = false
        message.info('已取消')
        msg?.destroy()
        return
      }
      isWaitForSelectAnime.value = true
      msg = message.info('在选择一个动画块后开始录制', { duration: 0 })
      startSpeech(() => {
        handleStartPause()
        isWaitForSelectAnime.value = false
        shortcut.push(
          fromEvent<KeyboardEvent>(window, 'keydown').subscribe(ev => {
            if(ev.key === 'Enter') {
              handleCut()
            }
          }),
          fromEvent<KeyboardEvent>(window, 'keydown').subscribe(ev => {
            if(ev.key === ' ' && ev.code === 'Space') {
              speechMethods.start()
            }
          }),
        )
        msg?.destroy()
      })
      return
    }
    handleStartPause()
  },
  stop: () => {
    if(!isStarted.value) return
    handleStopRecord()
    stopSpeech()
    shortcut.forEach(s => s.unsubscribe())
    emits('end')
  },
  cancel: () => {
    // if(!isStarted.value) return
    dialog.warning({
      title: '弃用',
      content: `是否放弃本段录制的结果?(已经生成的片段不会被放弃)`,
      positiveText: '确定',
      negativeText: '关闭',
      onPositiveClick: () => {
        isCancel = true
        handleStopRecord()
        stopSpeech()
        shortcut.forEach(s => s.unsubscribe())
        message.info('已取消')
      }
    })
  }
}

const subs = [
  ondataavailable.subscribe(async data => {
    try {
      if (isCancel) return isCancel = false // 取消
      const actions = getActionSequence()
      const duration = data.duration
      if (!data.isSilence) {
        // 小于 60s 的情况 直接创建片段
        if (duration <= 60) {
          const result = await AudioRecorder.toWAVBlob(data.blob)
          console.log('duration:', duration, result.duration, 'actions:', actions)
          await projectStore.fragment(props.id).createByAudio({
            audio: result.blob,
            duration: duration,
            speakerId: props.speakerId || '',
            actions
          })
          emits('output')
          return
        } else {
          // 大于 60s 的情况 分段之后再创建片段
          const audioCtx = new AudioContext()
          const arrayBuffer = await data.blob.arrayBuffer()
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

          const sampleRate = audioBuffer.sampleRate
          const segmentDuration = 60 // 每60秒一个分割点（分片不宜过短，否则会导致片段语音内容不连贯影响语音转写）
          const windowSize = 1 // 在±1秒的窗口中查找低音点
          const threshold = 0.01 // 定义静音/低音的阈值
          const audioData = audioBuffer.getChannelData(0)

          const lowPoints = findLowPoints(audioData, sampleRate, segmentDuration, windowSize, threshold)
          const cutPoints = lowPoints.map(point => Number((point / sampleRate).toFixed(3)))
          
              // 重新计算和分配动作关键帧
          const actionChunks: Action[][] = []
          const audioChunks = await splitAudio(audioBuffer, cutPoints, (previousPoint, currentPoint) => {
            actionChunks.push(
              actions.filter(action => {
                if(previousPoint <= action.keyframe && action.keyframe <= currentPoint) return true
              }).map(action => {
                action.keyframe = action.keyframe - previousPoint
                return action
              })
            )
          })

          // TODO 设置最大上传限制
          const tasks = audioChunks.map((audiobuffer, index) => {
            const wavData = AudioRecorder.audioBufferToWav(audiobuffer)
            const blob = new Blob([wavData], { type: 'audio/wav' })
            return projectStore.fragment(props.id).createByAudio({
              audio: blob,
              duration: audiobuffer.duration,
              speakerId: props.speakerId || '',
              actions: actionChunks[index]
            })
          })
          Promise.all(tasks).then(resp => {
            console.log('创建片段成功')
          }).catch(err => {
            console.log('创建片段失败')
          })
          return
        }
      }
      // TODO 一般可能最后一段音频才需要考虑是否包含说话声音
      if (actions && actions.length > 0) {
        const txtLength = Math.floor(data.duration / 0.5)
        console.log('空白语音段：', data.duration, txtLength)
        await projectStore.fragment(props.id).createBlank({
          txtLength,
          duration,
          actions
        })
        emits('output')
      }
    } catch (error) {
      message.error('创建音频片段失败')
    }
  }),
  onRecorderEnd.subscribe(info => {
    message.info(info)
    stopSpeech()
    emits('end')
  })
]

onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
})
</script>

<template>
  <div
    ref="stationEl"
    :class="{ station: 1, 'station-hide': !isShowStationToolbar, row: isRow, column: !isRow }"
    :style="{ left: `${offsetX}px`, top: `${offsetY}px` }"
  >
    <div :class="{ 'btn-group': true }">
      <div ref="handleEl" class="drag" @dblclick="isRow = !isRow">
        <span class="drag-line" />
        <span class="drag-line" />
      </div>

      <n-popselect v-model:value="mode" :options="options" trigger="click">
        <div class="btn">
          <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
            <span>{{ options.find(item => item.value === mode)?.txt }}</span>
            <span>模式</span>
          </div>
        </div>
      </n-popselect>

      <div class="btn" @click="speechMethods.start()">
        {{ isRecording ? '暂停' : isStarted ? '继续' : isWaitForSelectAnime ? '选择' : '开始' }}
        <Icon v-if="!isRecording && !isStarted && !isWaitForSelectAnime" icon="fluent:mic-48-regular" height="24" />
        <!-- <Icon v-if="!isRecording && isStarted" icon="fluent:mic-pulse-48-regular" height="24" /> -->
        <Icon v-if="isWaitForSelectAnime" icon="mynaui:location-selected" height="24" />
        <!-- <Icon v-if="isRecording" icon="svg-spinners:blocks-wave" height="24" /> -->
        <span v-if="isStarted">{{ formatTimeToMinutesSecondsMilliseconds(totalDuration) }}</span>
      </div>
      <div :class="{ btn: 1, disabled: !isStarted }" @click="speechMethods.stop()">
        停止
        <Icon icon="fluent:mic-off-48-regular" height="24" />
      </div>
      <div :class="{ btn: 1, disabled: !isStarted }" @click="handleCut">
        分段
        <Icon icon="solar:video-frame-cut-broken" height="24" />
      </div>
      <div :class="{ btn: 1 }" @click="isAutoCut = !isAutoCut">
        静音分段
        <Icon v-if="isAutoCut" icon="material-symbols:check-circle-outline" height="24" />
        <Icon v-if="!isAutoCut" icon="material-symbols:cancel-outline" height="24" />
      </div>
      <div :class="{ btn: 1 }" @click="speechMethods.cancel">
        弃用
        <Icon icon="ic:outline-comments-disabled" height="24" />
      </div>
      <!-- <div :class="{ btn: 1, disabled: !isStarted }" @click="handleWaveformVisible">
        波形图
        <Icon icon="mage:sound-waves" height="24" />
      </div> -->
      <Tip :style="{ top: '2px', right: '2px' }">
        <n-flex vertical style="width: 300px">
          <section>
            <h3>该功能为实验性功能</h3>
          </section>
          <section>
            <b>演讲模式</b>
            <div>模拟演讲过程，从选择的动画块位置开始录制，会隐藏之后的所有动画块，通过键盘 ↓ 方向键控制往后动画块显示，录制过程中显示的动画会自动标记到语音片段上。已经显示的动画不会再标记。</div>
          </section>
          <section>
            <b>讲解模式</b>
            <div>模拟讲解过程，从选择的动画块位置开始录制，录制过程中通过鼠标点击的动画块会自动标记到语音片段上。</div>
          </section>
          <section>
            <b>分段</b>
            <div>从当前时间点切割录音并生成片段信息。</div>
          </section>
          <section>
            <b>静音分段开关</b>
            <div>出现超过2秒的静音且无操作时自动输出已录制的音频并生成片段信息。</div>
          </section>
          <section>
            <b>快捷键</b>
            <div>Enter - 分段</div>
            <div>Space - 停止</div>
          </section>
        </n-flex>
      </Tip>
    </div>
    <!-- <div class="wave-area" v-show="!isStarted">
      <canvas v-show="isWaveformVisible" class="wave" ref="waveEl" />
    </div> -->
  </div>
  <!-- <div class="collapse-btn" @click="isShowStationToolbar = !isShowStationToolbar">
    <Icon :icon="isShowStationToolbar ? 'material-symbols:arrow-forward-ios-rounded' : 'material-symbols:arrow-back-ios-rounded'" height="24" />
  </div> -->
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.question {
  position: absolute;
  top: 3px;
  right: 3px;
}
.wave-area {
  position: absolute;
  border-radius: 3px;
  box-shadow: v-bind('themeVars.boxShadow3');
  background-color: v-bind('themeVars.cardColor');
}

.row {
  .btn-group {
    flex-direction: row;
    .btn {
      margin-left: 6px;
    }
  }

  .drag {
    display: flex;
    flex-direction: row;
    .drag-line {
      padding: 3px 0px;
      height: 100%;
      width: 3px;
      &:last-child {
        margin-left: 4px;
      }
    }
  }
  .wave-area {
    bottom: -63px;
    left: 0px;
    height: 60px;
    width: 100%;
  }
}
.column {
  .btn-group {
    flex-direction: column;
    .btn {
      margin-top: 6px;
      &:first-child {
        margin-top: 0px;
      }
    }
  }

  .drag {
    .drag-line {
      padding: 0 3px;
      height: 3px;
      width: 100%;
      &:last-child {
        margin-top: 4px;
      }
    }
  }
  .wave-area {
    top: 0px;
    right: -63px;
    width: 60px;
    height: 100%;
    // .wave {
    //   rotate: 90deg;
    //   transform: translateX(35%) translateY(80%);
    // }
  }
}
.drag {
  cursor: pointer;
  .drag-line {
    box-sizing: border-box;
    display: block;

    border-radius: 6px;
    background-color: v-bind('themeVars.iconColor');
  }
}
.station-hide {
  display: none;
  right: -80px !important;
  .collapse-btn {
    position: absolute;
    left: -44px;
    cursor: pointer;
  }
}
.station {
  z-index: 1;
  position: absolute;
  // top: 0;
  // right: 0;
  background-color: v-bind('themeVars.cardColor');
  border-radius: 3px;
  padding: 6px 6px;
  box-shadow: v-bind('themeVars.boxShadow3');
  .btn-group {
    display: flex;
    .btn {
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60px;
      width: 60px;
      background-color: v-bind('themeVars.buttonColor2');
      cursor: pointer;
      &:hover {
        background-color: v-bind('themeVars.buttonColor2Hover');
      }
      &:active {
        background-color: v-bind('themeVars.buttonColor2Pressed');
      }
    }
    .disabled {
      opacity: 0.5;
      // pointer-events: none;
    }
    .collapse-btn {
      z-index: 1;
      position: absolute;
      bottom: 50%;
      left: -20px;
      transform: translateY(50%);
      cursor: pointer;
    }
  }
}
</style>
