<script lang="ts" setup>
import Recorder from 'js-audio-recorder'
import { useThemeVars } from 'naive-ui'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { KeyboardOutlined } from '@vicons/material'
import { fromEvent, Subscription, debounceTime, auditTime, throttleTime, distinctUntilChanged } from '@tanbo/stream'
const props = defineProps<{
  shortcut: boolean
  readonly: boolean
}>()
const emits = defineEmits(['onAudioOutput'])
const themeVars = useThemeVars()
const recorder = new Recorder({
  sampleBits: 16,
  sampleRate: 16000
})
// console.log(recorder)
const data = reactive({
  audio: ref<Blob>(),
  duration: 0
})
let isRecording = ref(false)
const startRecorder = () => {
  // 开始录音
  // console.log('开始录音')
  isRecording.value = true
  recorder
    .start()
    .then(() => {
      // console.log('开始录音成功')
      // 处理在快速点击启动按钮后，创建在销毁之后，导致录音状态没有停止的问题
      if (!isRecording.value) {
        recorder.destroy()
      }
    })
    .catch(err => {
      console.log('启动录音失败', err)
    })
}

// recorder.onprocess = (data) => {
//   console.log('录音中', data)
// }
const stopRecorder = () => {
  // 停止录音
  isRecording.value = false
  // console.log('停止录音')
  recorder.stop()

  data.audio = recorder.getWAVBlob()
  data.duration = recorder.duration //语音的时长
  // console.log('录音结束')
  emits('onAudioOutput', data)
  recorder
    .destroy()
    .then(() => {
      // console.log('销毁成功')
    })
    .catch(err => {
      // console.log('销毁失败', err)
    })
  // console.log('录音销毁')
  // 采用 base64 编码的策略
  // const reader = new FileReader();
  // reader.readAsBinaryString(recorder.getWAVBlob())
  // reader.onload = function (e) {
  //   data.audio = e.target?.result as string
  //   emits('onAudioOutput', data)
  // }
}
const isPress = ref(false)
const keydownEvent: Subscription[] = []
const keyupEvent: Subscription[] = []
function useShortcut(state: boolean) {
  if (state) {
    keydownEvent.push(
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(debounceTime(50))
        .subscribe(e => {
          // console.log(e)
          if (e.ctrlKey && e.key === ' ' && !isPress.value) {
            console.log('录音中')
            isPress.value = true
            startRecorder()
            if (isPress.value) {
              keyupEvent.push(
                fromEvent<KeyboardEvent>(document, 'keyup').subscribe(e => {
                  if (e.key === ' ') {
                    console.log('停止录音')
                    setTimeout(() => {
                      isPress.value = false
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
    // console.log(state)
    useShortcut(state)
  }
)
onMounted(() => {
  useShortcut(props.shortcut)
})

onUnmounted(() => {
  keyupEvent.forEach(sub => sub.unsubscribe())
  keydownEvent.forEach(sub => sub.unsubscribe())
})
// function createTimer() {} // TODO 考虑是否在录音时显示录音时长
</script>

<template>
  <div :class="['ASR', readonly ? 'disabled' : '']">
    <button v-if="recorder" :class="['btn', readonly ? 'disabled' : '']" :disabled="readonly" @mousedown="startRecorder()" @mouseup="stopRecorder()">
      按住 说话
    </button>
    <div v-show="shortcut" class="shortcut">
      <n-popover trigger="hover" placement="bottom">
        <template #trigger>
          <n-icon :component="KeyboardOutlined" :size="24" />
        </template>
        <span>Ctrl + Space</span>
      </n-popover>
    </div>
  </div>
  <div v-if="isPress" class="recording">
    录音中...
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: 0.8;
  cursor: not-allowed !important;
}
.shortcut {
  cursor: pointer;
  position: absolute;
  top: 6px;
  right: 6px;
  opacity: 0.5;
}
.recording {
  // z-index: 999;
  position: fixed;
  // width: 100%;
  // height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: rgba(104, 104, 104, 0.158);
}
.ASR {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  // background-color: v-bind('themeVars.cardColor');
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
