<script lang="ts" setup>
import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Injector, Subscription } from '@textbus/core'
import _ from 'lodash'
import { Icon } from '@iconify/vue'
import { Player, UITip } from '../..'

const injector = inject('injector') as Injector
const player = injector.get(Player)
const controllerRef = ref<HTMLElement | null>(null)
const subs: Subscription[] = []
onMounted(() => {
  subs.push(
    player.onStateUpdate.subscribe(() => {
      state.isPlaying = player.isPlaying
      state.isPause = player.isPause
      state.isShowTool = true
      if (!state.isPause && !state.isPlaying) {
        state.isShowTool = false
      }
    })
  )
})

const state = reactive({
  isShowTool: false,
  isPlaying: false,
  isPause: false
})
const methods = {
  playpause() {
    if (!player.isPlaying && !player.isPause) {
      player.start()
      return
    }
    if (player.isPlaying && !player.isPause) return player.pause()
    if (!player.isPlaying && player.isPause) return player.resume()
  },
  stop() {
    player.stop()
  }
}
onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
})
</script>

<template>
  <div v-if="state.isShowTool" ref="controllerRef" class="controller">
    <div class="tools">
      <!-- 开始暂停继续 -->
      <div class="option">
        <UITip :tip="(!state.isPlaying && !state.isPause) ? '开始' : ((state.isPlaying && !state.isPause) ? '暂停' : '继续')">
          <n-button class="btn" block text :size="'large'" @click="methods.playpause">
            <Icon :icon="state.isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" height="24" />
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controller {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 96px;
  border-radius: 3px;
  border: 1px solid var(--tb-dividerColor);
  box-sizing: border-box;
  .dragger {
    height: 18px;
    background-color: var(--tb-cardColor);
    cursor: move;
  }
  .tools {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding: 6px;
    opacity: 0.5;
    transition: opacity 0.5s ease;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
