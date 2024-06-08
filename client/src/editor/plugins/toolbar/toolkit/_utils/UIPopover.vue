<script lang="ts" setup>
import { Keymap } from '@textbus/core'
import UIIcon from './UIIcon.vue'
import { computed, inject, provide, reactive, ref } from 'vue'
import type { Component } from 'vue'
import { useThemeVars } from 'naive-ui'
provide('useClose', handleClose)
const props = defineProps<{
  /** 快捷键配置 */
  keymap?: Keymap
  /** 给当前控件添加一组 css class */
  classes?: string[]
  /** 给当前控件添加一组 icon css class */
  iconClasses?: string[]
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string
  /** 设置控件显示的文字 */
  label?: string
  /** 弹出的内容 */
  view: Component
  highlight?: () => boolean
  disabled?: () => boolean
}>()
const state = reactive({
  highlight: computed(() => props.highlight?.()),
  disabled: computed(() => props.disabled?.())
})
const injector = inject('injector')
const themeVars = useThemeVars()
const isShow = ref(false)
const popoverRef = ref()
const btnRef = ref<HTMLElement>()
function handleClickoutside(ev: MouseEvent) {
  if (btnRef.value === ev.target) {
    return
  }
  isShow.value = false
}
function handleClose() {
  isShow.value = false
}
</script>

<template>
  <n-popover
    ref="popoverRef"
    trigger="click"
    placement="bottom-start"
    :flip="true"
    :show-arrow="false"
    :to="false"
    :show="isShow"
    :disabled="state.disabled"
    @clickoutside="handleClickoutside"
  >
    <template #trigger>
      <div ref="btnRef" :class="['trigger', state.disabled ? 'disabled' : '']" :title="tooltip" @click="isShow = !isShow">
        <div class="popover-left-btn">
          <UIIcon class="popover-icon" v-if="iconClasses" :icon="iconClasses ? iconClasses[0] : ''" :size="16" />
        </div>
        <div class="popover-right-btn">
          <UIIcon :class="['popover-caret', isShow ? 'active' : '']" icon="textbus-dropdown-caret" />
        </div>
      </div>
    </template>
    <div class="wrapper">
      <component class="popover-item" :is="view" />
    </div>
  </n-popover>
</template>

<style lang="scss" scoped>
.disabled {
  opacity: var(--tb-opacityDisabled)!important;
  cursor: not-allowed!important;
}
.trigger {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 34px;
  box-sizing: border-box;
  border-radius: 3px;
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
  .popover-left-btn {
    pointer-events: none;
    display: flex;
    align-items: center;
    height: 100%;
    user-select: none;
    padding: 2px 4px;
  }
  .popover-right-btn {
    pointer-events: none;
    display: flex;
    align-items: center;
    height: 100%;
    user-select: none;
    padding: 2px;
  }
  .popover-caret {
    transition: all 0.15s ease-in-out;
  }
  .active {
    transform: rotate(180deg);
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
}

:deep(.n-button) {
  --n-text-color-hover: none !important;
  --n-text-color-pressed: none !important;
  --n-text-color-focus: none !important;
}

</style>
