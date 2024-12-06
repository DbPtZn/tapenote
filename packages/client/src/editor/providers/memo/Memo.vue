<script lang="ts" setup>
import { Editor, Layout, createEditor, paragraphComponent, paragraphComponentLoader } from '@textbus/editor'
import { Injector } from '@textbus/core'
import { onMounted, ref, useTemplateRef, inject, onUnmounted, watch, computed, onBeforeUnmount } from 'vue'
import { useThemeVars } from 'naive-ui'
import { useDraggable } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Subscription, filter, fromEvent } from '@tanbo/stream'
import { MemoService, Structurer } from '../..'
import { Memo } from './memo.provider'
type BgColor = Memo['bgColor']
const injector = inject('injector') as Injector
const layout = injector.get(Layout)

// positive: relative; 在 middle 上，虽然元素插入到 workbench 中，但实际相对于 middle 进行定位
const middleEl = layout.middle 

const structurer = injector.get(Structurer)
const scrollerEl = structurer.scrollerEl
const editorWrapperEl = structurer.editorWrapperEl
const props = defineProps<{
  id: string
  isExpanded: boolean
  height: number
  width: number
  x: number
  y: number
  bgcolor: BgColor
  content: string
}>()

const emits = defineEmits<{
  resize: [id: string, height: number, width: number]
  move: [id: string, x: number, y: number]
  updateColor: [id: string, bgcolor: BgColor]
  expand: [id: string, isExpanded: boolean]
  delete: [id: string]
  save: [id: string, content: string]
}>()

const themeVars = useThemeVars()

const memoEl = useTemplateRef<HTMLElement>('memoEl')
// const draggerEl = useTemplateRef<HTMLElement>('draggerEl')
const handlerEl = useTemplateRef<HTMLElement>('handlerEl')
const editorEl = useTemplateRef<HTMLElement>('editorEl')
const verticalEl = useTemplateRef<HTMLElement>('verticalEl')
const horizontalEl = useTemplateRef<HTMLElement>('horizontalEl')
const nwseEl = useTemplateRef<HTMLElement>('nwseEl')
const drawerEl = useTemplateRef<HTMLElement>('drawerEl')
// console.log('props.isExpanded', props.isExpanded)
const isCollapsed = ref(!props.isExpanded)
const isEditorFocus = ref(false)
const isMemoFocus = ref(false)
const isDrawerVisible = ref(false)

let lastX = props.x
let lastY = props.y
const middleRect = middleEl.getBoundingClientRect()
const scrollerRect = scrollerEl!.getBoundingClientRect()
// console.log('props.x', props.x)
// console.log('props.x / 100 * middleRect.width', props.x / 100 * middleRect.width)
// props.x + (middleRect.left - scrollerRect.left)
const { x, y } = useDraggable(memoEl, {
  initialValue: { x: (props.x / 100 * middleRect.width) + (middleRect.left - scrollerRect.left), y: props.y },
  containerElement: scrollerEl,
  stopPropagation: true, // 阻止冒泡
  handle: handlerEl, // 指定控制元素, 区别于 draggingElement 指定的是拽动元素（触发 move 和 up 的元素，start 事件依旧会在根元素上触发）
  onMove(position, event) {
    // 达到最大滚动高度后，避免触底时增加滚动高度
    if (!scrollerEl || !memoEl.value) return
    const maxScrollHeight = scrollerEl.scrollHeight - scrollerEl.clientHeight;
    if(scrollerEl.scrollTop >= maxScrollHeight) {
      if (position.y + memoEl.value.offsetHeight >= scrollerEl.offsetHeight + scrollerEl.scrollTop - 30) {
        y.value = scrollerEl.offsetHeight + scrollerEl.scrollTop - memoEl.value.offsetHeight - 30
      }
    }
    
  },
  onEnd(position) {
    if (lastX === x.value && lastY === y.value) return // 避免点击的时候触发 position 更新
    // const middleRect = middleEl.getBoundingClientRect()
    // 'position.x - (middleRect.left - scrollerRect.left)' 因为 middleRect.left 会出现变化
    // const xPct = (position.x - (middleRect.left - scrollerRect.left)) / middleRect.width
    // console.log('xd', xPct)
    // 因为目前无法处理位置受工作区宽度影响的问题，所以改成固定到工作区左侧 -36
    // console.log(offsetX.value)
    emits('move', props.id, offsetX.value, position.y)
    lastX = x.value
    lastY = y.value
  }
})

const offsetX = computed(() => {
  const middleRect = middleEl.getBoundingClientRect()
  const editorWrapperRect = editorWrapperEl!.getBoundingClientRect()
  // const scrollerRect = scrollerEl!.getBoundingClientRect()
  // const workbenchRect = workbenchEl.getBoundingClientRect()
  // console.log('middleRect', middleRect.left, 'scrollerRect', scrollerRect.left, middleRect.left - scrollerRect.left)
  // console.log('x',  x.value - (middleRect.left - scrollerRect.left))
  // console.log('offsetx', (x.value - middleRect.left + rootRect.left) / middleRect.width * 100)
  // 改成百分比的模式，这样位置不会受到工作区宽度变化的影响
  return (x.value - middleRect.left + editorWrapperRect.left) / middleRect.width * 100
})

const offsetY = computed(() => {
  const middleRect = middleEl.getBoundingClientRect()
  const scrollerRect = scrollerEl!.getBoundingClientRect()
  return y.value - middleRect.top + scrollerRect.top - scrollerEl!.scrollTop
})



onMounted(() => {
  props.isExpanded && useEditor()
})

let editor: Editor | null = null
const subs1: Subscription[] = []
function useEditor() {
  if (!editorEl.value) return
  if (editor) return
  editor = createEditor({
    autoHeight: true,
    placeholder: '在此输入内容',
    content: props.content,
    formatters: [],
    formatLoaders: [],
    components: [paragraphComponent],
    componentLoaders: [paragraphComponentLoader],
    plugins: [],
  })
  const layout = editor.get(Layout)
  const middleEl = layout.middle
  const containerEl = layout.container
  containerEl.classList.add('memo-container')
  middleEl.classList.add('memo-middle')
  editor.mount(editorEl.value)
  subs1.push(
    editor.onFocus.subscribe(() => {
      isEditorFocus.value = true
    }),
    editor.onBlur.subscribe(() => {
      isEditorFocus.value = false
    })
  )
}


let isDrag = false // 拖拽时避免触发展开
let timer
function handleMouseDown(ev) {
  ev.preventDefault()
  timer = setTimeout(() => {
    isDrag = true
    clearTimeout(timer)
  }, 200)
}
function handleMouseUp(ev) {
  clearTimeout(timer)
  if (isDrag) {
    isDrag = false
    return
  }
  isCollapsed.value = !isCollapsed.value
  console.log('isCollapsed.value', isCollapsed.value)
  emits('expand', props.id, !isCollapsed.value)
  isDrag = false
  useEditor()
}

function getSize() {
  emits('resize', props.id, heightVal.value, widthVal.value)
}

const widthVal = ref(props.width || 300)
const heightVal = ref(props.height || 300)
let subs: Subscription[] = []
onMounted(() => {
  subs.push(
    fromEvent<MouseEvent>(verticalEl.value!, 'mousedown').subscribe(ev => {
      ev.preventDefault() // 缩放的时候不会选中主编辑器富文本
      ev.stopPropagation()
      const rect = scrollerEl!.getBoundingClientRect()
      const moveSub = fromEvent<MouseEvent>(document, 'mousemove').subscribe(ev => {
        widthVal.value = ev.clientX - x.value - rect.left
      })
      const upSub = fromEvent<MouseEvent>(document, 'mouseup').subscribe(ev => {
        getSize()
        moveSub.unsubscribe()
        upSub.unsubscribe()
      })
    }),
    fromEvent<MouseEvent>(horizontalEl.value!, 'mousedown').subscribe(ev => {
      ev.stopPropagation()
      ev.preventDefault()
      const rect = scrollerEl!.getBoundingClientRect()
      const moveSub = fromEvent<MouseEvent>(document, 'mousemove').subscribe(ev => {
        heightVal.value = ev.clientY - y.value - rect.top + scrollerEl!.scrollTop
      })
      const upSub = fromEvent<MouseEvent>(document, 'mouseup').subscribe(ev => {
        getSize()
        moveSub.unsubscribe()
        upSub.unsubscribe()
      })
    }),
    fromEvent<MouseEvent>(nwseEl.value!, 'mousedown').subscribe(ev => {
      ev.stopPropagation()
      ev.preventDefault()
      const rect = scrollerEl!.getBoundingClientRect()
      const moveSub = fromEvent<MouseEvent>(document, 'mousemove').subscribe(ev => {
        widthVal.value = ev.clientX - x.value - rect.left
        heightVal.value = ev.clientY - y.value - rect.top + scrollerEl!.scrollTop
      })
      const upSub = fromEvent<MouseEvent>(document, 'mouseup').subscribe(ev => {
        getSize()
        moveSub.unsubscribe()
        upSub.unsubscribe()
      })
    })
  )
})

onBeforeUnmount(() => {
  // console.log('memo destory')
  subs.forEach(sub => sub.unsubscribe())
  subs1.forEach(sub => sub.unsubscribe())
  editor?.destroy()
})

onUnmounted(() => {})

function handleFocus() {
  isMemoFocus.value = true
}
function handleBlur() {
  isMemoFocus.value = false
}
const isFocus = computed(() => isEditorFocus.value || isMemoFocus.value)

watch(
  () => isFocus.value,
  is => {
    if (!is && editor) {
      const content = editor.getHTML()
      if (content === props.content) return
      emits('save', props.id, editor.getHTML())
    }
  }
)

const colors = new Map<BgColor, { bgcolor: string; opcolor: string; tbcolor: string }>([
  ['yellow', { bgcolor: '#fff7d1', opcolor: '#ffe66e', tbcolor: '#fff2ab' }],
  ['green', { bgcolor: '#e4f9e0', opcolor: '#a1ef9b', tbcolor: '#cbf1c4' }],
  ['pink', { bgcolor: '#ffe4f1', opcolor: '#ffafdf', tbcolor: '#ffcce5' }],
  ['purple', { bgcolor: '#f2e6ff', opcolor: '#c9a3ee', tbcolor: '#e7cfff' }],
  ['blue', { bgcolor: '#e2f1ff', opcolor: '#93d0ee', tbcolor: '#cde9ff' }],
  ['white', { bgcolor: '#f3f2f1', opcolor: '#d1d1d1', tbcolor: '#e1dfdd' }],
  ['gray', { bgcolor: '#696969', opcolor: '#767676', tbcolor: '#494745' }]
])
const bgcolor = ref(colors.get(props.bgcolor)?.bgcolor || '#fff7d1')
const tbColor = ref(colors.get(props.bgcolor)?.tbcolor || '#ffe66e')
const textColor = ref('#000000')
function handleBgColorChange(key: BgColor) {
  emits('updateColor', props.id, key)
  const color = colors.get(key)!
  bgcolor.value = color.bgcolor
  tbColor.value = color.tbcolor
  if (bgcolor.value === '#696969') {
    textColor.value = '#ffffff'
  } else {
    textColor.value = '#000000'
  }
}
onMounted(() => {
  if (bgcolor.value === '#696969') {
    textColor.value = '#ffffff'
  } else {
    textColor.value = '#000000'
  }
})

function handleDrawerVisible() {
  isDrawerVisible.value = true
  const s = fromEvent(document, 'mousedown')
    .pipe(filter(ev => !(ev.target instanceof HTMLElement && ev.target.closest('.drawer'))))
    .subscribe(() => {
      isDrawerVisible.value = false
      s.unsubscribe()
    })
}

</script>

<template>
  <div
    ref="memoEl"
    tabindex="0"
    :class="{ memo: true, expand: !isCollapsed }"
    :style="{ maxHeight: `${heightVal}px`, maxWidth: `${widthVal}px`, left: `${offsetX}%`, top: `${offsetY}px`, backgroundColor: bgcolor }"
    @focus="handleFocus"
    @blur="handleBlur"
    @contextmenu.stop=""
  >
    <!-- 垂直控制器 -->
    <div class="handler-vertical">
      <div class="content">
        <div :class="{ 'expand-box': !isCollapsed, 'collapse-box': isCollapsed }">
          <div class="header" ref="handlerEl">
            <div v-if="isCollapsed" class="collapse-box" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
              <Icon v-if="isCollapsed" icon="basil:expand-outline" height="24px" />
            </div>
            <div v-show="!isCollapsed" :class="{ 'btn-group': true, focus: isFocus }" :style="{ backgroundColor: tbColor }" @mousedown.stop.prevent="">
              <div class="btn" @mousedown.stop="handleMouseDown" @mouseup.stop="handleMouseUp">
                <Icon icon="basil:collapse-outline" height="24px" />
              </div>
              <div class="btn" @click="handleDrawerVisible">
                <Icon icon="material-symbols:more-horiz" height="24px" />
              </div>
            </div>
          </div>
          <div class="main" v-show="!isCollapsed">
            <div class="editor" ref="editorEl" />
          </div>
        </div>
        <div ref="drawerEl" v-show="!isCollapsed" :class="{ drawer: true, 'drawer-visible': isDrawerVisible }">
          <div class="bgcolor-group">
            <div
              class="bgcolor-item"
              v-for="(color, index) in colors"
              :key="index"
              :style="{ backgroundColor: color[1].opcolor }"
              @click="handleBgColorChange(color[0])"
            >
              <Icon
                class="check"
                v-if="bgcolor === color[1].bgcolor"
                :style="{ backgroundColor: color[1].opcolor }"
                icon="material-symbols:check-rounded"
                height="20px"
              />
            </div>
          </div>
          <div class="option" @click="emits('delete', props.id)">
            <Icon class="icon" icon="material-symbols:delete" height="24px" />
            <span class="text"> 删除便笺 </span>
          </div>
        </div>
      </div>
      <div v-show="!isCollapsed" class="vertical" ref="verticalEl" />
    </div>

    <!-- 水平控制器 -->
    <div v-show="!isCollapsed" class="handler-horizontal">
      <div class="line" ref="horizontalEl" />
      <div class="nwse" ref="nwseEl" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drawer {
  z-index: 1;
  position: absolute;
  top: -100px;
  right: 0;
  width: 100%;
  max-width: 292px;
  height: 100px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  div {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .bgcolor-group {
    display: flex;
    background-color: #2b2b2b;
    .bgcolor-item {
      height: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
      .check {
        color: v-bind(textColor);
        pointer-events: none;
      }
    }
  }

  .option {
    color: #2b2b2b;
    background-color: aliceblue;
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon {
      margin-left: 10px;
      pointer-events: none;
    }
    .text {
      margin-left: 16px;
    }

    &:hover {
      background-color: #e2e2e2;
    }
  }
}
.drawer-visible {
  top: 0px;
  box-shadow: v-bind('themeVars.boxShadow1');
}
.vertical {
  width: 10px;
  margin-right: -10px;
  cursor: e-resize;
}

.memo {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}
.expand {
  height: 100%;
  width: 100%;
  min-width: 200px;
  min-height: 100px;
  max-height: 300px;
  max-width: 300px;
}
.content {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.handler-vertical {
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
  width: 100%;
}
.handler-horizontal {
  display: flex;
  flex-direction: row;
  .line {
    flex: 1;
    height: 10px;
    // background-color: rgba(255, 0, 0, 0.459);
    margin-bottom: -5px;
    cursor: s-resize;
  }
  .nwse {
    margin-right: -10px;
    margin-bottom: -5px;
    width: 10px;
    height: 10px;
    // background-color: #8cee307a;
    cursor: nwse-resize;
  }
}

.collapse-box {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 2px;
  border-radius: 3px;
  color: v-bind(textColor);
}
.expand-box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  // background-color: #bfdaa6;
}
.header {
  position: relative;
  height: 36px;
  overflow: hidden;
  // background-color: #a0b68b;
  .btn-group {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    transform: translateY(-100%);
    justify-content: space-between;
    transition: all 0.2s ease-in-out;
    .btn {
      z-index: 999;
      height: 100%;
      padding: 0 4px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: v-bind(textColor);
      &:hover {
        background-color: #9999992a;
      }
    }
  }
  .focus {
    transform: translateY(0);
  }
}
.main {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  .editor {
    width: 95%;
    margin: 0 auto;
    :deep(.memo-container) {
      outline: none;
      border: none;
      border-radius: 0;
      height: unset!important;
      margin: 0!important;
      color: v-bind(textColor)!important;
      background-color: v-bind(bgcolor)!important;
      .memo-middle {
        max-width: unset!important;
        background-color: v-bind(bgcolor)!important;
        border: none;
        background-color: unset;
        p {
          margin-top: 2px;
          margin-bottom: 2px;
          font-size: 13px;
        }
      }
    }
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 3px;
    height: 16px;
    background-color: unset;
    background-color: unset;
  }

  // /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: unset;
  }

  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: unset !important;
    background-color: unset !important;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #838383 !important;
    }
  }
}
/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// ::-webkit-scrollbar {
//   width: 4px;
//   height: 16px;
//   background-color: unset;
//   background-color:  v-bind('themeVars.bodyColor');
// }

// // /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   border-radius: 10px;
//   background-color: unset;
// }

// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   box-shadow: unset;
//   background-color: unset;
// }
</style>
