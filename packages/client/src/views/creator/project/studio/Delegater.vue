<script lang="ts" setup>
import { Subscription, fromEvent } from '@tanbo/stream'
import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { usePromoter } from './hooks'
import { Bridge } from '../bridge'
import useStore from '@/store';
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
}>()

const { projectStore } = useStore()
const { handlePromoterSelect, handlePromoterUpdate, handlePromoterRemove, handleAnimeLocate, checkAnimeState, checkPromoter } = usePromoter(props.id, bridge)
const delegaterRef = ref<HTMLElement>()
const updateRef = ref<HTMLElement>()
const subs1: Subscription[] = []
onMounted(() => {
  const scroller = delegaterRef.value?.parentElement
  if(scroller)
  subs1.push(
    fromEvent(scroller, 'scroll').subscribe(e => {
      popoverState.showPopover = false
    })
  )
})
onUnmounted(() => {
  subs1.forEach(s => s.unsubscribe())
  subs1.length = 0
  subs2.forEach(s => s.unsubscribe())
  subs2.length = 0
})

const handleClick = (e: MouseEvent) => {
  // console.log(e)
  const target = e.target as HTMLElement
  if(target.classList.contains('character')) {
    const fragment = getAncestorNodeByClassname(target, 'fragment')
    if (fragment) {
      const indexStr = target.dataset.index
      if (indexStr !== undefined) {
        const index = parseInt(indexStr)
        characterMethods.setFocus(target) // 激活启动子预设状态聚焦动画
        if(!target.classList.contains('marked')) {
          handlePromoterSelect(fragment.id, index)
        } else {
          const rect = target.getBoundingClientRect()
          popoverState.showPopover = true
          popoverState.x = rect.x + rect.width / 2
          popoverState.y = rect.y
          popoverState.currentFragmentId = fragment.id
          popoverState.currentPromoterIndex = index
          return
        }
      }
    }
  }
}

function getAncestorNodeByClassname(node: HTMLElement, className: string) {
  let parent = node.parentElement
  while (parent) {
    if(parent.classList.contains('studio')) return null
    if (parent.classList.contains(className)) return parent
    parent = parent.parentElement
  }
  return null
}

function getFragment(fragmentId: string) {
  return projectStore.findFragment(props.id, fragmentId)
}

const subs2: Subscription[] = []
const characterMethods = {
  setFocus(target: HTMLElement) {
    if (!target.classList.contains('focus')) {
      target.classList.add('focus', 'animate__animated', 'animate__pulse', 'animate__infinite')
      if (subs2.length > 0) {
        subs2.forEach(s => s.unsubscribe())
        subs2.length = 0
      }
      subs2.push(
        fromEvent(document, 'click', true).subscribe(event => {
          // 如果不是更新操作，则要监听是否点击元素自身
          if (event.target === updateRef.value) return
          target.classList.remove('focus', 'animate__animated', 'animate__pulse', 'animate__infinite')
          subs2.forEach(s => s.unsubscribe())
          subs2.length = 0
        })
      )
    }
  }
}

const popoverState = reactive({
  showPopover: false,
  x: 0,
  y: 0,
  currentPromoterIndex: 0,
  currentFragmentId: '',
})

const popoverMethods = {
  handleUpdate() {
    // console.log('update')
    const fragmentId = popoverState.currentFragmentId
    const fragment = getFragment(fragmentId)
    // console.log(fragment)
    const index = popoverState.currentPromoterIndex
    // console.log([fragmentId, index, fragment?.promoters[index]])
    fragment && handlePromoterUpdate(
      fragmentId,
      index, 
      fragment.promoters[index]
    )
    popoverState.showPopover = false
  },
  handleRemove() {
    // console.log('remove')
    const fragmentId = popoverState.currentFragmentId
    const index = popoverState.currentPromoterIndex
    handlePromoterRemove(fragmentId, index)
    popoverState.showPopover = false
  },
  handleLocate() {
    // console.log('locate')
    const fragmentId = popoverState.currentFragmentId
    const fragment = getFragment(fragmentId)
    const index = popoverState.currentPromoterIndex
    fragment && handleAnimeLocate(fragment.promoters[index])
    popoverState.showPopover = false
  },
  handleClickoutside() {
    popoverState.showPopover = false
  }
}


</script>

<template>
  <div ref="delegaterRef" class="delegater" :style="{ width: '100%' }" @click="handleClick">
    <slot />
  </div>
  <n-popover :show="popoverState.showPopover" :x="popoverState.x" :y="popoverState.y" trigger="manual" @clickoutside="popoverMethods.handleClickoutside">
    <n-button text @click="popoverMethods.handleUpdate">
      <span ref="updateRef">更新</span>
    </n-button>
    |
    <n-button text @click="popoverMethods.handleRemove">移除</n-button>
    |
    <n-button text @click="popoverMethods.handleLocate">定位</n-button>
  </n-popover>
</template>

<style lang="scss" scoped>

</style>
