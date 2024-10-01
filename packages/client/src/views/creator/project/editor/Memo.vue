<script lang="ts" setup>
import { createEditor } from '@textbus/editor'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useThemeVars } from 'naive-ui'
import { useDraggable } from '@vueuse/core'
import { inject } from 'vue'
import { Icon } from '@iconify/vue'
import { Bridge } from '../bridge'

const bridge = inject('bridge') as Bridge
const props = defineProps<{
  rootEl: HTMLElement
}>()

const themeVars = useThemeVars()

const memoEl = useTemplateRef<HTMLElement>('memoEl')
const draggerEl = useTemplateRef<HTMLElement>('draggerEl')
const editorEl = useTemplateRef<HTMLElement>('editorEl')

const isCollapse = ref(false)

const { x, y, style } = useDraggable(memoEl, {
  // initialValue: { x: rect.width - 100, y: rect.height / 2 },
  containerElement: bridge.rootEl,
  // draggingElement: draggerEl,
  // preventDefault: true, // 阻止默认事件 (阻止拖拽时选中文本)
  stopPropagation: true // 阻止冒泡
})

onMounted(() => {
  console.log('memoEl', bridge.rootEl)
  if (!editorEl.value) return
  const editor = createEditor({
    autoHeight: true,
    placeholder: '在此输入内容',
    content: '<p>hello world</p>',
    plugins: []
  })
  editor.mount(editorEl.value)
})

let isDrag = false
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
  if(isDrag) return isDrag = false
  isCollapse.value = !isCollapse.value
  isDrag = false
}

</script>

<template>
  <div :class="{ memo: true, expand: !isCollapse }" ref="memoEl" :style="style">
    <div 
      v-if="isCollapse" class="collapse-box" 
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <Icon v-if="isCollapse" icon="basil:expand-outline" height="24px" />
    </div>
    <div v-if="!isCollapse" class="expand-box">
      <div class="header">
        <div class="btn" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
          <Icon v-if="!isCollapse" icon="basil:collapse-outline" height="24px" />
        </div>
        <div class="btn">
          <Icon icon="material-symbols:more-horiz" height="24px" />
        </div>
      </div>
      <div class="main">
        <div class="editor" ref="editorEl" />
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.memo {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
}
.expand {
  height: 100%;
  width: 100%;
  max-height: 300px;
  max-width: 300px;
}
.collapse-box {
  display: flex;
  align-items: center;
  background-color: #a0b68b;
  height: 36px;
  padding: 0 4px;
  border-radius: 3px;
}
.expand-box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background-color: #bfdaa6;
}
.header {
  height: 36px;
  background-color: #a0b68b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    height: 100%;
    padding: 0 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #83838327;
    }
  }
}
.main {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;

  .editor {
    // height: 100%;
    width: 95%;
    margin: 0 auto;
    :deep(.textbus-container) {
      // height: 100% !important;
      outline: none;
      border: none;
      border-radius: 0;
      color: #000;
      // background-color: #bfdaa6;
      .textbus-ui-middle {
        // height: 100%;
        border: none;
        background-color: unset;
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
