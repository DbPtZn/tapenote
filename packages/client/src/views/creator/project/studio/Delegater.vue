<script lang="ts" setup>
import { Subscription, auditTime, debounceTime, fromEvent } from '@tanbo/stream'
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
// import { ArrowDownwardFilled } from '@vicons/material'
import { usePromoter } from './hooks'
import { Bridge } from '../bridge'
import useStore from '@/store'
import { useMessage, useThemeVars } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { AnimeProvider, AnimeService } from '@/editor'
import { watch } from 'vue'
const bridge = inject('bridge') as Bridge
const props = defineProps<{
  id: string
  allowSelectAnime: boolean
}>()

const { projectStore } = useStore()
const { handlePromoterSelect, handlePromoterUpdate, handlePromoterRemove, handleAnimeLocate, makePreset } = usePromoter(props.id, bridge)
const message = useMessage()
const themeVars = useThemeVars()
// const { t } = useI18n()

const delegaterRef = ref<HTMLElement>()
const updateRef = ref<HTMLElement>()
const pointerRef = ref<HTMLElement>()
const editorRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)
let animeMap: HTMLElement[] = []
const isAutoMoveAnimePointer = ref(false)
let lastPointerTarget: HTMLElement | null = null

const pointerIndex = ref(-1)
let isArrowUp = false // 标记用户是否按下了键盘向上键
const pointerTarget = ref<HTMLElement | null>(null)
watch(() => pointerIndex.value, () => {
  if (pointerIndex.value === -1) {
    pointerTarget.value = null
    return
  }
  pointerTarget.value = getCurrentAnime()
})

// 通过指针获取当前的动画元素
function getCurrentAnime() {
  let index = pointerIndex.value // 使用一个局部变量来存储新的索引值，避免直接修改 pointerIndex 导致递归调用
  // 可能遇到多个元素不存在的问题，得循环处理
  while(animeMap[index] && ((editorRef.value && !editorRef.value.contains(animeMap[index])) || !animeMap[index].dataset.id)) {
    animeMap.splice(index, 1)
    isArrowUp && index > 0 && index-- // 如果是向上操作，则删除一个元素后指针索引减一 (同时对上边界的情况进行处理)
  }
  // 针对下边界的情况进行处理(达到下边界时，指针可能指向数组中不存在的元素（或溢出数组），控制指针减一)
  if (!isArrowUp && !animeMap[index]) {
    index--
  }
  isArrowUp = false
  const anime = animeMap[index]
  pointerIndex.value = index  // 更新指针位置（这里会导致 watch 再调用一次，但因为下一次 index 不会改变，所以只会重复一次，且没有产生影响）
  return anime
}

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
      x = pointerTargetRect.x + pointerTargetRect.width - pointerRect.width/2 - scrollerRect.left
      y = pointerTargetRect.top - pointerRect.height - scrollerRect.top + scrollerRef.value!.scrollTop
    } else {
      // 不包含图片的情况
      const lastTextChildRect = getTextNodeEndPosition(pointerTarget.value)
      x = lastTextChildRect.x - pointerRect.width / 2 - scrollerRect.left
      y = lastTextChildRect.y - pointerRect.height - scrollerRect.top + scrollerRef.value!.scrollTop
    }
  }
  if((pointerTarget.value?.tagName.toLocaleLowerCase() === 'anime-component' || pointerTarget.value?.dataset.anime === 'true') && pointerRef.value) {
    // 动画组件一般是 block div 盒子,动画标记一般位于右上角
    pointerTarget.value?.classList.add('anime-component-box') // 添加 'block' 'outline' 属性帮助提示范围\定位
    pointerTargetRect = pointerTarget.value.getBoundingClientRect()
    const pointerRect = pointerRef.value.getBoundingClientRect()
    x = pointerTargetRect.x + pointerTargetRect.width - pointerRect.width/2 - scrollerRect.left
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

// TODO 开启自动移动后,预设第一个动画后会自动向下移动指针.?
// 优化 动画列表是开启后生成的,如果中间添加了新的动画,是不会加入到列表中的,需要解决这个问题.

const subs1: Subscription[] = []
const subs2: Subscription[] = []
const subs5: Subscription[] = []
let selectAnimeElement: HTMLElement | null = null
onMounted(() => {
  const scroller = delegaterRef.value?.parentElement
  if(!scroller) return
  subs1.push(
    fromEvent(scroller, 'scroll').subscribe(e => {
      popoverState.showPopover = false
    }),
    // 自动动画指针功能状态变更时触发
    bridge.onAutoMoveAnimePointerChange.subscribe(isOpen => {
      isAutoMoveAnimePointer.value = isOpen
      if(isOpen && bridge.editorEl && bridge.scrollerEl) {
        const elements = bridge.editorEl.querySelectorAll<HTMLElement>(`[data-id]:not([data-id=""])`)
        animeMap = Array.from(elements)
        scrollerRef.value = bridge.scrollerEl
        scrollerRef.value.style.position = 'relative' // 添加 'relative' 作为 pointer 绝对定位参照系
        subs2.push(
          fromEvent<KeyboardEvent>(window, 'keydown').pipe(auditTime(0)).subscribe(e => {
            if(!props.allowSelectAnime) return
            if (pointerIndex.value === -1) return // -1 是关闭状态
            if(['Space', 'ArrowDown'].includes(e.code)) {
              if(pointerIndex.value < animeMap.length - 1) pointerIndex.value++
              else message.info(`到底啦!`)
            }
            if(e.code === 'ArrowUp') {
              if(pointerIndex.value > 0) {
                isArrowUp = true
                pointerIndex.value--
              }
            }
          }),
          fromEvent<PointerEvent>(bridge.editorEl, 'click').subscribe(e => {
            if(!props.allowSelectAnime) return
            const target = e.target as HTMLElement
            const animeElement = AnimeProvider.toAnimeElement(target)
            if (!animeElement) return
            const index = animeMap.findIndex(element => element === animeElement)
            if(index !== -1) pointerIndex.value = index
            bridge.handleBlur() // 移除焦点
          })
        )
      } else {
        subs2.forEach(s => s.unsubscribe())
        pointerTarget.value?.classList.remove('anime-box', 'anime-img', 'anime-component-box')
        lastPointerTarget = null
        subs2.length = 0
        animeMap = []
        pointerIndex.value = 0
      }
    }),
    bridge.onEditorReady.subscribe((editor) => {
      editorRef.value = bridge.editorEl
      const animeService = editor.get(AnimeService)
      subs5.push(
        animeService.onAnimeAdd.pipe(debounceTime(100)).subscribe(() => {
          if(!isAutoMoveAnimePointer.value) return
          console.log('anime add')
          const elements = bridge.editorEl!.querySelectorAll<HTMLElement>(`[data-id]:not([data-id=""])`)
          animeMap = Array.from(elements)
        }),
        fromEvent(editorRef.value!, 'click').pipe(auditTime(5)).subscribe(e => {
          // 延迟 5ms , 与 s 错开时间，这样在动画块之间切换的时候 selectAnimeElement 不会被 s 事件覆盖消除
          if(!props.allowSelectAnime) return
          if(isAutoMoveAnimePointer.value) return
          const target = e.target as HTMLElement
          const animeElement = AnimeProvider.toAnimeElement(target)
          if (!animeElement) return
          // if (animeElement.dataset.active === 'true') return
          selectAnimeElement = animeElement
          selectAnimeElement.classList.add('anime-preset')
          const s = fromEvent(document, 'click', true).pipe(auditTime(0)).subscribe(event => {
            // 延迟 0ms, 转化成宏任务，这样 handleClick(微任务) 将优先执行，能正确获取到 selectAnimeElement
            const node = event.target as HTMLElement
            const animeNode = AnimeProvider.toAnimeElement(node)
            if(animeNode === animeElement) return // 再次点击相同动画块的时候不处理
            animeElement?.classList.remove('anime-preset')
            selectAnimeElement = null
            s.unsubscribe()
          })
        })
      )
    })
  )
})

onUnmounted(() => {
  subs1.forEach(s => s.unsubscribe())
  subs1.length = 0
  subs2.forEach(s => s.unsubscribe())
  subs2.length = 0
  subs3.forEach(s => s.unsubscribe())
  subs3.length = 0
  subs4.forEach(s => s.unsubscribe())
  subs4.length = 0
  subs5.forEach(s => s.unsubscribe())
  subs5.length = 0
})

let subs4: Subscription[] = []
const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if(target.classList.contains('character')) {
    const fragment = getAncestorNodeByClassname(target, 'fragment')
    if (fragment) {
      const indexStr = target.dataset.index
      if (indexStr !== undefined) {
        const index = parseInt(indexStr)
        characterMethods.setFocus(target) // 激活启动子预设状态聚焦动画
        if(!target.classList.contains('marked')) {
          // 是否开启自动移动动画指针功能
          if(isAutoMoveAnimePointer.value) {
            if(pointerIndex.value === -1) {
              // 先通过片段选择文字再选择动画的情况
              handlePromoterSelect(fragment.id, index)
              subs4.length === 0 && subs4.push(bridge.onAddPromoter.subscribe(element => {
                const index = animeMap.findIndex(item => item === element)
                subs4.forEach(sub => sub.unsubscribe())
                subs4.length = 0
                if(index !== -1) pointerIndex.value = index + 1
              }))
              return
            }
            if(!pointerTarget.value) return
            const id = pointerTarget.value.dataset.id
            const serial = pointerTarget.value.dataset.serial
            handlePromoterSelect(fragment.id, index, id, serial)
            pointerIndex.value++
            return
          }
          // 未开启动画指针模式的情况
          // 已经选中动画元素的情况
          if(selectAnimeElement) {
            const id = selectAnimeElement.dataset.id
            const serial = selectAnimeElement.dataset.serial
            if(!id || !serial) return
            makePreset(fragment.id, index, id, serial)
            return
          }
          // 未选择动画元素的情况
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

function handleAutoMoveAnimePointerEnd() {
  pointerTarget.value?.classList.remove('anime-box', 'anime-img', 'anime-component-box')
  pointerIndex.value = -1
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

const subs3: Subscription[] = []
const characterMethods = {
  setFocus(target: HTMLElement) {
    if (!target.classList.contains('focus')) {
      target.classList.add('focus', 'animate__animated', 'animate__pulse', 'animate__infinite')
      if (subs3.length > 0) {
        subs3.forEach(s => s.unsubscribe())
        subs3.length = 0
      }
      subs3.push(
        fromEvent(document, 'click', true).subscribe(event => {
          // 如果不是更新操作，则要监听是否点击元素自身
          if (event.target === updateRef.value) return
          target.classList.remove('focus', 'animate__animated', 'animate__pulse', 'animate__infinite')
          subs3.forEach(s => s.unsubscribe())
          subs3.length = 0
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
      <Icon icon="mdi:arrow-down-bold" height="36px" />
    </div>
  </Teleport>
  <Teleport :to="'body'">
    <div v-if="isAutoMoveAnimePointer && pointerIndex !== -1" class="tip">
      <div class="tip-content">
        <Icon class="tip-icon" icon="ic:sharp-tips-and-updates" height="20px" />
        <span class="tip-text" >{{ $t('studio.msg.auto_move_anime_pointer_tip') }}</span>
        <span class="tip-text">通过键盘 <Icon icon="mdi:arrow-up-bold" height="14px" /> <Icon icon="mdi:arrow-down-bold" height="14px" /> 键可以移动指针</span>
        <Icon class="close-icon" icon="ic:round-cancel" height="20px" @click="handleAutoMoveAnimePointerEnd" />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.tip {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  .tip-content {
    display: flex;
    align-items: center;
    margin-left: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    color: v-bind('themeVars.textColor1');
    background-color: v-bind('themeVars.modalColor');
    box-shadow: v-bind('themeVars.boxShadow1');
    .tip-icon {
      color: v-bind('themeVars.primaryColor');
    }
    .tip-text {
      display: flex;
      align-items: center;
      margin: 0 8px;
      user-select: none;
      .iconify {
        border: 1px solid v-bind('themeVars.borderColor');
        &:first-child {
          margin-left: 4px;
        }
        &:last-child {
          margin-left: 4px;
          margin-right: 4px;
        }
      }
    }
    .close-icon {
      cursor: pointer;
      &:hover {
        color: v-bind('themeVars.primaryColor');
      }
      &:active {
        color: v-bind('themeVars.buttonColor2Pressed');
      }
    }
  }
}
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
  color: #e03f3f;
  pointer-events: none;
  animation: bounce 1s infinite;
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