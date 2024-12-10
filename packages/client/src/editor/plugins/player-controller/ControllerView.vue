<script lang="ts" setup>
import { VNode, inject, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { MessageReactive, useMessage } from 'naive-ui'
import { Injector, Keyboard, Subscription, auditTime, fromEvent } from '@textbus/core'
import _ from 'lodash'
import { useDraggable } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { formatTime } from './formatTime'
import { Player, Structurer, generateRandomString } from '../..'
import { UITip } from '../..'
import { reactive } from 'vue'

const injector = inject<Injector>('injector')!
const player = injector.get(Player)
const structurer = injector.get(Structurer)
const editorWrapperEl = structurer.editorWrapperEl!
const scrollerEl = structurer.scrollerEl!
const message = useMessage()
const subs: Subscription[] = []
const controllerData = ref<VNode[]>([])
const controllerRef = ref<HTMLElement | null>(null)
const isFixed = ref(false)
const isAutoHide = ref(false)
const isControllerShow = ref(true)

const draggerRef = ref<HTMLElement | null>(null)
const rect = editorWrapperEl.getBoundingClientRect()
const { x, y, style } = useDraggable(controllerRef, {
  initialValue: { x: rect.width - 100, y: rect.height / 2 },
  containerElement: editorWrapperEl,
  preventDefault: true, // 阻止默认事件 (阻止拖拽时选中文本)
  stopPropagation: true // 阻止冒泡
})
window.onresize = function () {
  // console.log('窗口大小改变')
  if (x.value > rect.width) {
    x.value = rect.width - 100
  }
  if (y.value > rect.height) {
    y.value = rect.height - 100
  }
  isFixed.value = false
}
function handleChange() {
  x.value = rect.width - 100
  y.value = rect.height / 2 - controllerRef.value!.clientHeight / 2
  isFixed.value = !isFixed.value
  isFixed.value ? message.create('开启控制器拖拽') : message.create('关闭控制器拖拽')
  if (isFixed.value) {
    subs.forEach(sub => sub.unsubscribe())
  }
}
function handleHideController() {
  if (isFixed.value) return
  isAutoHide.value = !isAutoHide.value
  if (isAutoHide.value) {
    subs.push(
      fromEvent<MouseEvent>(editorWrapperEl, 'mousemove')
        .pipe(auditTime(100))
        .subscribe(ev => {
          // const rect = editorWrapperEl.getBoundingClientRect()
          isControllerShow.value = rect.right - ev.clientX < 100
        })
    )
    message.create('开启控制器自动隐藏')
  } else {
    subs.forEach(sub => sub.unsubscribe())
    message.create('关闭控制器自动隐藏')
  }
}

const duration = ref(0)
const currentTime = ref(0)
const silderPosition = ref(0)
let timeFrame = 0
let isSliderMousedown = false
function handleSliderMousedown() {
  isSliderMousedown = true
  const move = fromEvent<MouseEvent>(document, 'mousemove').subscribe(ev => {
    silderPosition.value += ev.movementY / 2.5
    currentTime.value = (silderPosition.value / 100) * duration.value
    if (silderPosition.value < 0) return (silderPosition.value = 0)
    if (silderPosition.value > 100) return (silderPosition.value = 100)
  })
  const up = fromEvent(document, 'mouseup').subscribe(() => {
    isSliderMousedown = false
    // console.log('up', silderPosition.value)
    const timenode = silderPosition.value
    if (!player.isPlaying) {
      player.start()
      // console.log('start')
    }
    // console.log('player.duration', player.duration)
    // console.log('timenode', timenode, player.duration * timenode / 100)
    timeFrame = Number(((player.duration * timenode) / 100).toFixed(2))
    // console.log(timeFrame)
    if(timeFrame > duration.value) timeFrame = duration.value
    player.seek(timeFrame)
    move.unsubscribe()
    up.unsubscribe()
  })
}
const playerSub: Subscription[] = []
onMounted(() => {
  useScrollerPause()
  useKeyboard()
  let msg: MessageReactive
  playerSub.push(
    player.onPlay.subscribe(() => {
      silderPosition.value = (player.currentTime / player.duration) * 100
    }),
    player.onStop.subscribe(() => {
      silderPosition.value = 0
      currentTime.value = 0
    }),
    player.onTimeUpdate.subscribe(time => {
      if (player.isPlaying && !isSliderMousedown) {
        silderPosition.value = (time / player.duration) * 100
        currentTime.value = time
      }
    }),
    player.onSourceDataLoaded.subscribe(data => {
      duration.value = data[0]?.duration || 0
    }),
    player.onStateUpdate.subscribe(() => {
      state.isPlaying = player.isPlaying
      state.isPause = player.isPause
    }),
    player.onSubtitleUpdate.subscribe(() => {
      state.subtitle = player.subtitle
    }),
    player.onLoadingStateChange.subscribe(state => {
      if(state.loading) {
        msg = message.loading('正在加载动画数据...', { duration: 0 })
        return
      }
      if(!state.loading) {
        msg?.destroy()
        if (state.error) message.error('加载动画音频数据失败！')
      }
    })
  )
})

const scrollerSub: Subscription[] = []
function useScrollerPause() {
  scrollerSub.push(
    fromEvent<WheelEvent>(scrollerEl, 'wheel').subscribe((ev) => {
      if (ev.deltaY < 0) {
        // console.log('滚动条向上')
        if (player.isPlaying) {
          player.pause()
          message.info('已暂停播放')
        }
      }
    })
  )
}
const KeyboardSub: Subscription[] = []
function useKeyboard() {
  scrollerSub.push(
    // 监听空格键 播放暂停
    fromEvent<KeyboardEvent>(document, 'keypress').subscribe((ev) => {
      if (ev.key === ' ' && ev.code === 'Space') {
        methods.playpause()
        ev.preventDefault()
        return
      }
    }),
    // 监听键盘上下键 快进快退
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((ev) => {
      if (!state.isPlaying) return 
      if (ev.key === 'ArrowDown' && ev.code === 'ArrowDown') {
        methods.forward()
        ev.preventDefault()
        return
      }
      if (ev.key === 'ArrowUp' && ev.code === 'ArrowUp') {
        methods.rewind()
        ev.preventDefault()
      }
    })
  )
}

const state = reactive({
  isPlaying: false,
  isPause: false,
  isSilence: false,
  subtitle: '',
  isSubtitleShow: true,
  isShowTimeline: true,
  recordVolume: 100, // 记录静音前的音量
  volume: 100,
  speed: 1,
})
const methods = {
  speedUpdate() {
    player.setSpeed(state.speed)
  },
  rewind() {
    player.rewind()
  },
  playpause() {
    if (!player.isPlaying && !player.isPause) {
      player.start()
      player.setSpeed(state.speed)
      player.setVolume(state.volume/100)
      return
    }
    if (player.isPlaying && !player.isPause) return player.pause()
    if (!player.isPlaying && player.isPause) return player.resume()
  },
  forward() {
    player.forward()
  },
  silenced() {
    state.isSilence = !state.isSilence
    if(state.isSilence) {
      state.recordVolume = state.volume
      state.volume = 0
      player.setVolume(0)
      return
    }
    state.volume = state.recordVolume
    player.setVolume(state.volume/100)
  },
  volumeUpdate() {
    // console.log('volumeUpdate', state.volume)
    player.setVolume(state.volume/100)
  },
  replay() {
    player.replay()
  },
  stop() {
    player.stop()
  },
  handleTimeline: () => {
    state.isShowTimeline = !state.isShowTimeline
  },
  handleSubtitle() {
    state.isSubtitleShow = !state.isSubtitleShow
  },
}

onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
  playerSub.forEach(sub => sub.unsubscribe())
  scrollerSub.forEach(sub => sub.unsubscribe())
  KeyboardSub.forEach(sub => sub.unsubscribe())
  controllerData.value = []
  window.onresize = function () {}
})

</script>

<template>
  <div v-show="isControllerShow" ref="controllerRef" :class="['controller', isFixed ? 'fixed' : '']" :style="style">
    <div ref="draggerRef" class="dragger" :style="{ cursor: isFixed ? 'move' : 'pointer' }" @dblclick="handleChange">
      <Icon icon="material-symbols:drag-handle-rounded" height="24" />
    </div>
    <div class="tools">
      <!-- 播放速度 -->
      <div class="option">
        <n-popover placement="left" trigger="hover">
          <template #trigger>
            <n-button class="btn" block text :size="'large'" @click="">
              <Icon icon="line-md:speed-loop" height="24" />
            </n-button>
          </template>
          <div class="speed-slider">
            <div class="speed-text">
              {{ state.speed.toFixed(1) }}X
            </div>
            <n-slider v-model:value="state.speed" :min="0.5" :max="3" :step="0.1" reverse :show-tooltip="false" :tooltip="false" @update:value="methods.speedUpdate" />
          </div>
        </n-popover>
      </div>
      <!-- 倒退 -->
      <div class="option">
        <UITip :tip="'倒退2秒'">
          <n-button class="btn" block text :size="'large'" @click="methods.rewind()">
            <Icon icon="ic:outline-keyboard-double-arrow-up" height="24" />
          </n-button>
        </UITip>
      </div>
      <!-- 开始暂停继续 -->
      <div class="option">
        <UITip :tip="(!state.isPlaying && !state.isPause) ? '开始' : ((state.isPlaying && !state.isPause) ? '暂停' : '继续')">
          <n-button class="btn" block text :size="'large'" @click="methods.playpause">
            <Icon :icon="state.isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" height="24" />
          </n-button>
        </UITip>
      </div>
      <!-- 前进 -->
      <div class="option">
        <UITip :tip="'前进2秒'">
          <n-button class="btn" block text :size="'large'" @click="methods.forward()">
            <Icon icon="ic:outline-keyboard-double-arrow-down" height="24" />
          </n-button>
        </UITip>
      </div>
      <!-- 音量 -->
      <div class="option">
        <n-popover placement="left" trigger="hover">
          <template #trigger>
            <n-button class="btn" block text :size="'large'" @click="methods.silenced">
              <Icon :icon="state.isSilence ? 'material-symbols:no-sound-rounded' : 'material-symbols:volume-up-rounded' " height="24" />
            </n-button>
          </template>
          <div class="volume-slider">
            <div class="volume-text">
              {{ state.volume }}
            </div>
            <n-slider v-model:value="state.volume" :min="0" :max="100" :step="1" reverse :show-tooltip="false" :tooltip="false" @update:value="methods.volumeUpdate" />
          </div>
        </n-popover>
      </div>
      <!-- 重播 -->
      <div class="option">
        <UITip :tip="'重播'">
          <n-button class="btn" block text :size="'large'" @click="methods.replay()" :disabled="currentTime === 0">
            <Icon icon="material-symbols:replay" height="24" />
          </n-button>
        </UITip>
      </div>
      <!-- 停止 -->
      <div class="option">
        <UITip :tip="'停止'">
          <n-button class="btn" block text :size="'large'" @click="methods.stop()" :disabled="!state.isPlaying && !state.isPause">
            <Icon icon="material-symbols:stop-rounded" height="24" />
          </n-button>
        </UITip>
      </div>
      <!-- 时间轴开关 -->
      <div class="option">
        <UITip :tip="state.isShowTimeline ? '关闭时间轴' : '开启时间轴'">
          <n-button class="btn" block text :size="'large'" @click="methods.handleTimeline()">
            <Icon :icon="state.isShowTimeline ? 'mdi:timeline' : 'mdi:timeline-outline'" height="24" />
          </n-button>
        </UITip>
      </div>
      <!-- 字幕开关 -->
      <div class="option">
        <UITip :tip="state.isSubtitleShow ? '关闭字幕' : '开启字幕'">
          <n-button class="btn" block text :size="'large'" @click="methods.handleSubtitle()">
            <Icon :icon="state.isSubtitleShow ? 'material-symbols:subtitles' : 'material-symbols:subtitles-off'" height="24" />
          </n-button>
        </UITip>
      </div>
    </div>
    <div class="footer" @dblclick="handleHideController"></div>
  </div>
  <div v-if="state.isShowTimeline" class="time-line">
    <div class="start"></div>
    <div class="end"></div>
    <div class="slider" :style="{ top: `${silderPosition}%` }" @mousedown="handleSliderMousedown()">
      <div class="current-time">{{ formatTime(currentTime) }}</div>
    </div>
    <div class="duration">
      {{ formatTime(duration) }}
    </div>
  </div>
  <div v-if="state.isSubtitleShow" v-show="!!state.subtitle" class="subtitle">
    {{ state.subtitle }}
  </div>
</template>

<style lang="scss" scoped>
.subtitle {
  text-align: center;
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 12px;
  border-radius: 6px;
  background-color: var(--tb-subtitleBgColor);
  color: var(--tb-textColor1);
  font-size: 24px;
}
.speed-slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 380px;
  .speed-text {
    width: 32px;
    padding-right: 6px;
  }
}
.volume-slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 150px;
  .volume-text {
    width: 32px;
    padding-right: 6px;
  }
}
.tools {
  box-sizing: border-box;
  padding: 6px;
  .option {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background-color: var(--tb-buttonColor2Hover);
    }
    .btn {
      height: 100%;
    }
  }
}
.time-line {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 120px;
  width: 1px;
  height: 250px;
  // background-color: rgba(240, 248, 255, 0.733);
  background-color: var(--tb-timelineBgColor);
  display: flex;
  justify-content: center;
  .start {
    position: absolute;
    margin-top: -3.5px;
    height: 7px;
    width: 7px;
    border-radius: 7px;
    background-color: var(--tb-timelineDotColor);
  }
  .end {
    position: absolute;
    bottom: -3.5px;
    height: 7px;
    width: 7px;
    border-radius: 7px;
    background-color: var(--tb-timelineDotColor);
  }
  .slider {
    position: absolute;
    margin-top: -6.5px;
    // transform: translateY(12px);
    top: 0%;
    left: -12.5px;
    width: 25px;
    height: 12px;
    background-color: var(--tb-timelineSliderColor);
    border-radius: 3px;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .circle {
      height: 3px;
      width: 3px;
      border-radius: 3px;
      background-color: red;
    }
    .current-time {
      position: absolute;
      top: -4px;
      left: 28px;
      opacity: 0.7;
    }
  }
  .duration {
    position: absolute;
    bottom: -28px;
    left: -18px;
    opacity: 0.7;
  }
}
.wrapper {
  position: relative;
}
.fixed {
  position: fixed;
}
.controller {
  max-width: 48px;
  border-radius: 3px;
  border: 1px solid var(--tb-dividerColor);
  background-color: var(--tb-cardColor);
  box-sizing: border-box;
  animation: fadeInRight 0.1s ease-in-out;
  .dragger {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    background-color: var(--tb-modalColor);
    cursor: move;
    &:hover {
      background-color: var(--tb-buttonColor2Hover);
    }
  }
  .footer {
    height: 18px;
    background-color: var(--tb-modalColor);
  }
}
</style>
