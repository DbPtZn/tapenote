<script lang="ts" setup>
import { MessageReactive, SelectOption, useMessage, useThemeVars } from 'naive-ui'
import { computed, inject, onUnmounted, ref, useTemplateRef } from 'vue'
import { useDraggable } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import useStore from '@/store'
import { AudioRecorder } from './_utils/recorder'
import { TipBtn } from './private'
import { formatTimeToMinutesSecondsMilliseconds } from './_utils/formatTime'
import { useRecorder, useSpeech } from './hooks'
import { Bridge } from '../bridge'

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
  onStateUpdate,
  onRecorderEnd,
  ondataavailable,
  getCurrentDuration,
  handleOperate,
  handleStartPause,
  handleStopRecord,
  handleCut,
  handleWaveformVisible
} = useRecorder()
const { startSpeech, stopSpeech, getActionSequence } = useSpeech(bridge, getCurrentDuration, handleOperate)

const isWaitForSelectAnime = ref(false)
let msg: MessageReactive | undefined = undefined
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
        msg?.destroy()
      })
      return
    }
    handleStartPause()
  },
  stop: () => {
    handleStopRecord()
    stopSpeech()
    // isStartedRecorder.value = false
    emits('end')
  }
}

const subs = [
  ondataavailable.subscribe(async data => {
    try {
      const actions = getActionSequence()
      const duration = data.duration
      if (!data.isSilence) {
        const blob = await AudioRecorder.toWAVBlob(data.blob)
        console.log('duration:', duration, 'actions:', actions)
        await projectStore.fragment(props.id).createByAudio({
          audio: blob,
          duration: duration,
          speakerId: props.speakerId || '',
          actions
        })
        emits('output')
        return
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

const recMode = ref('speech')
const options: SelectOption[] = [
  {
    label: '演讲模式',
    value: 'speech',
    txt: '演讲'
  },
  {
    label: '解读模式',
    value: 'interpretation',
    txt: '解读'
  }
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

      <n-popselect v-model:value="recMode" :options="options" trigger="click">
        <div class="btn">
          <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }">
            <span>{{ options.find(item => item.value === recMode)?.txt }}</span>
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
      <!-- <div :class="{ btn: 1, disabled: !isStarted }" @click="handleWaveformVisible">
        波形图
        <Icon icon="mage:sound-waves" height="24" />
      </div> -->
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
      pointer-events: none;
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
