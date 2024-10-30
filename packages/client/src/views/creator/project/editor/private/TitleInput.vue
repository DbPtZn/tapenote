<template>
  <div :class="['title', isSticky && 'title-Sticky']">
    <div v-if="!allowAddCover" class="add-cover" @click="emits('addCover')">
      <Icon icon="ic:outline-add-photo-alternate" />
      <span>添加封面</span>
    </div>
    <div class="title-wrapper" ref="titleEl">
      <div
        ref="textarea"
        class="title-input"
        placeholder="在此输入标题"
        spellcheck="false"
        rows="1"
        :contenteditable="editable && !readonly"
        @input="inputEvent"
        @keypress.enter.prevent="handleEnter"
      >
        {{ titleInput }}
      </div>
      <div v-if="allowSticky" :class="['sticky', isSticky ? 'lock' : '']" @click="handleSticky">
        <NIcon :component="isSticky ? LockRound : LockOpenRound" :size="24" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, Ref, ref, useTemplateRef } from 'vue'
import { watchOnce } from '@vueuse/core'
import { useMessage, useThemeVars } from 'naive-ui'
import { LockRound, LockOpenRound } from '@vicons/material'
import { watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Bridge } from '../../bridge'

const bridge = inject('bridge') as Bridge
const themeVars = useThemeVars()
const message = useMessage()
const emits = defineEmits<{
  input: [string]
  sticky: [boolean]
  addCover: []
  enter: []
}>()
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: [String, Number],
    default: 980
  },
  editable: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  allowSticky: {
    type: Boolean,
    default: true
  },
  allowAddCover: {
    type: Boolean,
    default: true
  },
})
const maxWidthVal = computed<string>(() => {
  if (typeof props.maxWidth === 'number') return props.maxWidth + 'px'
  return props.maxWidth
})
const textarea = ref()
const titleEl = useTemplateRef<HTMLElement>('titleEl')
const titleInput = ref<string>(props.value)

onMounted(() => {
  bridge.titleEl = titleEl.value
})

// 应用历史快照时监听变化
watch(
  () => props.value,
  () => {
    // console.log(props.value)
    if (titleInput.value !== props.value) {
      titleInput.value = props.value
    }
  }
)
// const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g
// 不能在检查时禁止英文单引号 ' ，因为输入法输入时会产生单引号
const regexg = /[<>:"/\\|?*]/g
const regex = /[<>:"/\\|?*]/
const inputEvent = (ev: any) => {
  // .trim() 不能在输入的时候清理两段空白字符，这会导致光标跳回起始位置
  let inputVal = ev.target.innerText
  if (regexg.test(inputVal)) {
    // 特殊标点符号如 "/" 可能会导致导出时将部分标题解析成目录
    message.warning('标题中不应包含以下任何字符：< > : " / \\ | ? *')
    inputVal = inputVal.replace(regex, '')
    textarea.value.innerText = inputVal
  }
  if (inputVal.length > 200) {
    message.warning('标题不应大于 200 个字符')
    // 截取前500个字符重新赋值给文本框
    inputVal = inputVal.slice(0, 200)
    textarea.value.innerText = inputVal
    // keepCursorEnd(e.target)
  }
  titleInput.value = inputVal
  emits('input', titleInput.value.trim())
}

const handleEnter = (ev: any) => {
  textarea.value.blur()
  emits('enter')
}

const isSticky = ref(false)
const handleSticky = () => {
  isSticky.value = !isSticky.value
  emits('sticky', isSticky.value)
}
watchOnce(
  () => props.value,
  () => {
    titleInput.value = props.value
  }
)
// const keepCursorEnd = (obj: HTMLElement) => {
//   if (window.getSelection) {
//     // 解决firefox不获取焦点无法定位问题
//     obj.focus()
//     // 创建range
//     let range = window.getSelection()
//     // range 选择obj下所有子内容
//     range && range.selectAllChildren(obj)
//     // 光标移至最后
//     range && range.collapseToEnd()
//   }
// }
</script>

<style lang="scss" scoped>
.title-Sticky {
  position: sticky;
  top: 0px;
  z-index: 1;
  opacity: 0.8;
}

.add-cover {
  z-index: 1;
  position: absolute;
  top: -10px;
  left: 0;
  display: none;
  align-items: center;
  color: v-bind('themeVars.textColor3');
  font-size: 16px;
  cursor: pointer;
  span {
    font-size: 14px;
    margin-left: 2px;
  }
}

.title {
  position: relative;
  max-width: v-bind(maxWidthVal);
  width: 100%;
  // max-width: 880px;
  margin: 0 auto;
  // padding: 0 250px 0 250px;
  .title-wrapper {
    position: relative;
    padding: 18px 12px;
    // margin: 24px 0;
    // background-color: v-bind('themeVars.cardColor');
    background-color: v-bind('themeVars.bodyColor');
    // background-color: var(--dpz-editor-pgColor);
    border-bottom: 1px solid v-bind('themeVars.dividerColor');
    .title-input {
      // width: 100%;
      font-size: 36px;
      font-weight: 600;
      border: none;
      outline: none;
      white-space: pre-wrap;
      word-break: break-all;
      word-wrap: break-word;
      &:empty:before {
        cursor: text;
        border: none;
        content: attr(placeholder);
        color: rgba(143, 143, 143, 0.64);
      }
    }
    &:hover {
      .sticky {
        opacity: 1;
      }
    }
  }
  &:hover {
    .add-cover {
      display: flex;
    }
  }
}
.lock {
  opacity: 1 !important;
}
.sticky {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 10px;

  padding: 3px;
  // background-color: v-bind('themeVars.buttonColor2');
  border-radius: 3px;
  user-select: none;
  cursor: pointer;

  display: flex;
  align-items: center;

  transition: opacity 0.2s ease-in-out;

  // &:hover {
  //   background-color: v-bind('themeVars.buttonColor2Hover');
  // }
  // &:active {
  //   background-color: v-bind('themeVars.buttonColor2Pressed');
  // }
}
</style>
