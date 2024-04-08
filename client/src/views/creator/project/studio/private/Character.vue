<script lang="ts" setup>
import { ref } from 'vue'
import { useThemeVars } from 'naive-ui'
import { Subscription, fromEvent } from '@tanbo/stream'
const props = defineProps<{
  isMarked: boolean
}>()
const emits = defineEmits<{
  onSelect: [],
  onUpdate: [],
  onRemove: [],
  onLocate: []
}>()
const themeVars = useThemeVars()
const targetRef = ref(null)
const popoverRef = ref()
const subs: Subscription[] = []
const isFocus = ref(false)

const onSelect = (ev: MouseEvent) => {
  if (props.isMarked) return
  isFocus.value = true
  emits('onSelect')
  listenClickOutside()
}

function handleUpdate() {
  isFocus.value = true
  emits('onUpdate')
  popoverRef.value.setShow(false)
  listenClickOutside(true)
}
/** 删除 */
function handleRemove() {
  emits('onRemove')
}
/** 定位 */
function handleLocate() {
  emits('onLocate')
  popoverRef.value.setShow(false)
}
/** 监听点击元素外部的事件 */
function listenClickOutside(isUpdate = false) {
  if (subs.length > 0) {
    subs.forEach(sub => sub.unsubscribe())
    subs.length = 0
  }
  subs.push(
    fromEvent(document, 'click', true).subscribe(event => {
      // 如果不是更新操作，则要监听是否点击元素自身
      if (!isUpdate) {
        if (event.target === targetRef.value) return
      }
      isFocus.value = false
      subs.forEach(sub => sub.unsubscribe())
      subs.length = 0
    })
  )
}
</script>
<!-- n-popover :to="false" 该配置会出现溢出隐藏问题 -->
<template>
  <n-popover ref="popoverRef" trigger="click" :disabled="!isMarked">
    <template #trigger>   
      <span
        ref="targetRef"
        class="animation-layer"
        :class="isFocus ? 'character focus animate__animated animate__pulse animate__infinite' : 'character'"
        @click="onSelect"
      >
        <slot />
      </span>
    </template>
    <n-button text @click="handleUpdate">更新</n-button>
    |
    <n-button text @click="handleRemove">移除</n-button>
    |
    <n-button text @click="handleLocate">定位</n-button>
  </n-popover>
</template>

<style lang="scss" scoped>
.animation-layer {
  display: inline-block;
  margin: 2px 5px;
}
.character {
  color: v-bind('themeVars.textColor2')!important;
  user-select: none;
  cursor: pointer;
  &:hover {
    color: v-bind('themeVars.textColor1');
  }
  &:active {
    text-shadow: 1px 0px rgb(131, 131, 131);
  }
}
// .focus {
//   color: v-bind('themeVars.primaryColor')!important;
//   border-radius: 3px;
//   box-sizing: border-box;
//   outline: 1px solid v-bind('themeVars.tagColor');
// }
</style>
