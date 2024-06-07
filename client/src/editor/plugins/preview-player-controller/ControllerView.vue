<script lang="ts" setup>
import { VNode, inject, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useThemeVars } from 'naive-ui'
import { Injector, Subscription } from '@textbus/core'
import _ from 'lodash'
import * as UUID from 'uuid'
import elementResizeDetector from 'element-resize-detector'
import { Player } from '../..'
const injector = inject('injector') as Injector
const player = injector.get(Player)
const props = defineProps<{
  cmpts: VNode[]
}>()
const erd = elementResizeDetector()
const themeVars = useThemeVars()
const controllerData = ref<VNode[]>([])
const controllerRef = ref<HTMLElement | null>(null)
onBeforeMount(() => {
  controllerData.value = props.cmpts.map(vnode => {
    vnode.key = UUID.v4()
    return vnode
  })
})
const subs: Subscription[] = []
const isPlaying = ref(false)
onMounted(() => {
  subs.push(
    player.onStateUpdate.subscribe(() => {
      if (player.isPlaying || player.isPause) {
        isPlaying.value = true
      }
    }),
    player.onPlayOver.subscribe(() => {
      isPlaying.value = false
    })
  )
})
onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
  controllerData.value = []
})
</script>

<template>
  <div v-if="isPlaying" ref="controllerRef" class="controller">
    <div class="tools">
      <component class="tool-item" v-for="node in controllerData" :key="(node.key as string)" :is="node" />
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
