<script lang="ts" setup>
import { Subscription, fromEvent } from '@tanbo/stream'
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ArrowDownwardFilled } from '@vicons/material'
import { usePromoter } from './hooks'
import { Bridge } from '../bridge'
import useStore from '@/store'
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
}>()

const { projectStore } = useStore()
const { handlePromoterSelect, handlePromoterUpdate, handlePromoterRemove, handleAnimeLocate } = usePromoter(props.id, bridge)
const delegaterRef = ref<HTMLElement>()
const updateRef = ref<HTMLElement>()
const pointerRef = ref<HTMLElement>()
const editorRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)
const animeMap = ref<HTMLElement[]>([])
const pointerIndex = ref(0)
let isAutoMoveAnimePointer = false
let lastPointerTarget: HTMLElement | null = null
const subs3: Subscription[] = []
const pointerTarget = computed(() => animeMap.value[pointerIndex.value])
const pointerPositon = computed(() => {
  let x = 0
  let y = 0
  if(!pointerTarget.value) return { x, y }
  lastPointerTarget?.classList.remove('anime-box', 'anime-img', 'anime-component-box')

  const scrollerRect = scrollerRef.value!.getBoundingClientRect()
  let pointerTargetRect = pointerTarget.value.getBoundingClientRect()

  if(pointerTarget.value?.tagName.toLocaleLowerCase() === 'anime' && pointerRef.value) {
    pointerTarget.value?.classList.add('anime-box') // 添加  'outline' 属性提示范围
    const pointerRect = pointerRef.value.getBoundingClientRect()
    const imageNodes = pointerTarget.value.getElementsByTagName('img')
    if(imageNodes.length > 0) {
      pointerTarget.value?.classList.add('anime-img') // 添加 'inline-block' 属性帮助定位
      pointerTargetRect = pointerTarget.value.getBoundingClientRect()
      // 包含图片的情况, 动画标记一般位于图片文字所在的盒子右上角
      x = pointerTargetRect.x + pointerTargetRect.width - pointerRect.width/2 - 1
      y = pointerTargetRect.top - pointerRect.height - scrollerRect.top + scrollerRef.value!.scrollTop
    } else {
      // 不包含图片的情况
      const lastTextChildRect = getTextNodeEndPosition(pointerTarget.value)
      x = lastTextChildRect.x - pointerRect.width/2 - 1 
      y = lastTextChildRect.y - pointerRect.height - scrollerRect.top + scrollerRef.value!.scrollTop
    }
  }
  if(pointerTarget.value?.tagName.toLocaleLowerCase() === 'anime-component' && pointerRef.value) {
    // 动画组件一般是 block div 盒子,动画标记一般位于右上角
    pointerTarget.value?.classList.add('anime-component-box') // 添加 'block' 'outline' 属性帮助提示范围\定位
    pointerTargetRect = pointerTarget.value.getBoundingClientRect()
    const pointerRect = pointerRef.value.getBoundingClientRect()
    x = pointerTargetRect.x + pointerTargetRect.width - pointerRect.width/2 - 1
    y = pointerTargetRect.y - pointerRect.height - scrollerRect.top + scrollerRef.value!.scrollTop
  } 
  lastPointerTarget = pointerTarget.value
  scrollerRef.value?.scrollBy({ top: pointerTargetRect.top - scrollerRect.top - 200, behavior: 'smooth' })
  return {
    x,
    y
  }
})

/** 递归查询最后一个文本节点的坐标(因为我们无法获取到伪元素,所以只能以最后一个文本节点坐标为参考) */
function getTextNodeEndPosition(element: HTMLElement | ChildNode) {
  const lastChild = element.lastChild
  if (!lastChild) {
    const rect = (element as HTMLElement).getBoundingClientRect()
    return rect
  }
  if (lastChild.nodeType === Node.TEXT_NODE) {
    // 如果最后一个子节点是文本节点
    const range = document.createRange()
    range.setStart(lastChild, (lastChild as any).length)
    range.setEnd(lastChild, (lastChild as any).length)

    const rect = range.getBoundingClientRect()
    return rect
  }
  // 如果最后一个子节点不是文本节点，递归查找
  return getTextNodeEndPosition(lastChild)
}

const subs1: Subscription[] = []
onMounted(() => {
  const scroller = delegaterRef.value?.parentElement
  if(scroller)
  subs1.push(
    fromEvent(scroller, 'scroll').subscribe(e => {
      popoverState.showPopover = false
    }),
    bridge.onAutoMoveAnimePointerChange.subscribe(isOpen => {
      isAutoMoveAnimePointer = isOpen
      if(isOpen && bridge.editorRef && bridge.scrollerRef) {
        const elements = bridge.editorRef.querySelectorAll<HTMLElement>("[data-id]")
        animeMap.value = Array.from(elements)
        scrollerRef.value = bridge.scrollerRef
        scrollerRef.value.style.position = 'relative' // 添加 'relative' 作为 pointer 绝对定位参照系
        subs3.push(
          fromEvent<KeyboardEvent>(window, 'keydown').subscribe(e => {
            // console.log(e)
            if(['Space', 'ArrowDown'].includes(e.code)) {
              pointerIndex.value++
            }
            if(e.code === 'ArrowUp') {
              if(pointerIndex.value > 0) pointerIndex.value--
            }
          }),
          fromEvent<PointerEvent>(bridge.editorRef, 'click').subscribe(e => {
            const target = e.target as HTMLElement
            console.log(target)
            const index = animeMap.value.findIndex(element => element === (target.tagName.toLocaleLowerCase() === 'anime' ? target : (target.classList.contains('anime-component-tab') ? target.parentElement : '')))
            if(index !== -1) pointerIndex.value = index
          })
        )
      }
    }),
    bridge.onEditorReady.subscribe(() => {
      editorRef.value = bridge.editorRef
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
  // bridge.handleAutoMoveAnimePointer(true)
  const target = e.target as HTMLElement
  if(target.classList.contains('character')) {
    const fragment = getAncestorNodeByClassname(target, 'fragment')
    if (fragment) {
      const indexStr = target.dataset.index
      if (indexStr !== undefined) {
        const index = parseInt(indexStr)
        characterMethods.setFocus(target) // 激活启动子预设状态聚焦动画
        if(!target.classList.contains('marked')) {
          if(isAutoMoveAnimePointer) {
            const id = pointerTarget.value.dataset.id
            const serial = pointerTarget.value.dataset.serial
            handlePromoterSelect(fragment.id, index, id, serial)
            pointerIndex.value++
            return
          }
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
  <Teleport :to="scrollerRef || 'body'">
    <!-- 未使用时通过 visibility 隐藏,启用时才可以读取到其宽高 -->
    <div class="pointer" ref="pointerRef" :style="{ visibility: !!pointerTarget ? 'visible' :'hidden', zIndex: !!pointerTarget ? 999 : -1, left: pointerPositon.x + 'px', top: pointerPositon.y + 'px' }">
      <n-icon :component="ArrowDownwardFilled" :size="36" />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@keyframes bounce {
  0% {
    transform: translateY(-13px);
  }
  50% {
    transform: translateY(0px); /* 下降的距离 */
    animation-timing-function: ease-out; /* 快速下降 */
  }
  100% {
    transform: translateY(-13px); /* 高抬的距离 */
    animation-timing-function: ease-in; /* 缓慢抬高 */
  }
}

.pointer {
  position: absolute;
  color: red;
  pointer-events: none;
  // animation: bounce 1s infinite;
}

</style>
<!-- const pointerPositon = computed(() => {
  let x = 0
  let y = 0
  if(!pointerTarget.value) return { x, y }
  lastPointerTarget?.classList.remove('anime-box', 'anime-component-box')
  const pointerTargetRect = pointerTarget.value.getBoundingClientRect()
  const scrollerRect = scrollerRef.value!.getBoundingClientRect()
  if(pointerTarget.value?.tagName.toLocaleLowerCase() === 'anime' && pointerRef.value) {
    pointerTarget.value?.classList.add('anime-box') // 添加 'relative' 'inline-block' 'outline' 属性帮助定位
    const lastTextChildRect = getTextNodeEndPosition(pointerTarget.value)
    const pointerRect = pointerRef.value.getBoundingClientRect()
    const imageNodes = pointerTarget.value.getElementsByTagName('img')
    if(imageNodes.length > 0) {
      // 包含图片的情况, 动画标记一般位于图片文字所在的盒子右上角
      x = pointerTargetRect.width - pointerRect.width/2
      y = -pointerRect.height
    } else {
      // 不包含图片的情况, 需要计算最后一个文本相对于其所在的盒子的位置来作为指针箭头位置参照
      x = lastTextChildRect.x - pointerTargetRect.left - pointerRect.width/2
      y = lastTextChildRect.y - pointerTargetRect.top - pointerRect.height/2 - 23
    }
  }
  if(pointerTarget.value?.tagName.toLocaleLowerCase() === 'anime-component' && pointerRef.value) {
    // 动画组件一般是 block div 盒子,动画标记一般位于右上角
    pointerTarget.value?.classList.add('anime-component-box') // 添加 'relative' 'block' 'outline' 属性帮助定位
    // const pointerTargetRect = pointerTarget.value.getBoundingClientRect()
    const pointerRect = pointerRef.value.getBoundingClientRect()
    x = pointerTargetRect.width - pointerRect.width/2 - 11.5
    y = -pointerRect.height
  }
  lastPointerTarget = pointerTarget.value
  scrollerRef.value?.scrollBy({ top: pointerTargetRect.top - scrollerRect.top - 200, behavior: 'smooth' })
  return {
    x,
    y
  }
}) -->