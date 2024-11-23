<script lang="ts" setup>
import Recorder from 'js-audio-recorder'
import { useThemeVars } from 'naive-ui'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
// import { KeyboardOutlined } from '@vicons/material'
import { fromEvent, Subscription, debounceTime, auditTime, throttleTime, distinctUntilChanged, filter } from '@tanbo/stream'
import { AudioRecorder } from '../_utils/recorder'
const props = defineProps<{
  shortcut: boolean
  readonly: boolean
}>()
const emits = defineEmits<{
  output: [
    data: {
      audio: Blob | undefined
      duration: number
    }
  ]
  inputting: [boolean]
}>()
const themeVars = useThemeVars()
const recorder = new AudioRecorder({
  sampleRate: 16000,
  sampleBits: 16,
})

// console.log(recorder)
let data = {
  audio: undefined as Blob | undefined,
  duration: 0
}
let isRecording = ref(false)
const startRecorder = () => {
  // 开始录音
  // console.log('开始录音')
  if(isRecording.value) return
  emits('inputting', true)
  isRecording.value = true
  recorder.start()
    .then(() => {
      // console.log('开始录音成功')
      // 处理在快速点击启动按钮后，创建在销毁之后，导致录音状态没有停止的问题
      if (!isRecording.value) {
        console.log('录音已停止，无法继续录音')
        recorder.init()
      }
    })
    .catch(err => {
      console.log('启动录音失败', err)
    })
}

const stopRecorder = async () => {
  // 停止录音
  isRecording.value = false
  emits('inputting', false)
  // console.log('停止录音')
  recorder.stop().then(async (audiobuffer) => {
    // console.log('录音结束')
    const wavData = AudioRecorder.audioBufferToWav(audiobuffer)
    const wavBlob = new Blob([wavData], { type: 'audio/wav' })
    data.audio = wavBlob
    data.duration = audiobuffer.duration
    emits('output', data)
    recorder.init()
  }).catch(err => {
    recorder.init()
    console.log('录音失败', err)
  })
}
const isPress = ref(false)
const keydownEvent: Subscription[] = []
const keyupEvent: Subscription[] = []
function useShortcut(state: boolean) {
  if (state) {
    keydownEvent.push(
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          debounceTime(50),
          filter(e => e.ctrlKey && e.code === 'Numpad0' && e.key === '0')
        )
        .subscribe(e => {
          if (e.ctrlKey && e.key === '0' && !isPress.value) {
            isPress.value = true
            emits('inputting', isPress.value)
            startRecorder()
            if (isPress.value) {
              keyupEvent.push(
                fromEvent<KeyboardEvent>(document, 'keyup').subscribe(e => {
                  // console.log('松开')
                  if (e.key === '0') {
                    // console.log('停止录音')
                    setTimeout(() => {
                      isPress.value = false
                      emits('inputting', isPress.value)
                    }, 100)
                    stopRecorder()
                    keyupEvent.forEach(sub => sub.unsubscribe())
                  }
                })
              )
            }
          }
        })
    )
  } else {
    keyupEvent.forEach(sub => sub.unsubscribe())
    keydownEvent.forEach(sub => sub.unsubscribe())
  }
}
watch(
  () => props.shortcut,
  state => {
    useShortcut(state)
  }
)
onMounted(() => {
  useShortcut(props.shortcut)
})

onUnmounted(() => {
  keyupEvent.forEach(sub => sub.unsubscribe())
  keydownEvent.forEach(sub => sub.unsubscribe())
  recorder.destroy()
})
// function createTimer() {} // TODO 考虑是否在录音时显示录音时长
</script>

<template>
  <div :class="['ASR', readonly ? 'disabled' : '']">
    <button v-if="recorder" :class="['btn', readonly ? 'disabled' : '']" :disabled="readonly" @mousedown="startRecorder()" @mouseup="stopRecorder()">
      按住 说话
    </button>
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: 0.8;
  cursor: not-allowed !important;
}
.ASR {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: v-bind('themeVars.bodyColor');
  .btn {
    height: 100px;
    width: 100px;
    border-radius: 90px;
    box-shadow: v-bind('themeVars.boxShadow1');
    color: v-bind('themeVars.textColor3');
    border: none;
    background-color: v-bind('themeVars.buttonColor2');
    cursor: pointer;
    &:active {
      color: v-bind('themeVars.textColor1');
      background-color: v-bind('themeVars.buttonColor2Pressed');
    }
  }
}
</style>
