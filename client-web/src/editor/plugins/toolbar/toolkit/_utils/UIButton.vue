<script lang="ts" setup>
import { Keymap } from '@textbus/core'
import UIIcon from './UIIcon.vue'
import { Component, computed, reactive } from 'vue'
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const props = defineProps<{
  iconClasses?: (string | Component)[]
  size?: number
  label?: string
  tooltip?: string
  onClick(): void
  keymap?: Keymap
  highlight?: () => boolean
  disabled?: () => boolean
}>()
const state = reactive({
  highlight: computed(() => props.highlight?.()),
  disabled: computed(() => props.disabled?.()),
})
function handleClick() {
  props.onClick && props.onClick()
}
</script>

<template>
  <div class="button-tool" :data-keymap='JSON.stringify(keymap)' :class="state.highlight ? 'active' : ''" :title="tooltip" @click="handleClick">
    <n-button class="btn" block text :size="'large'" :disabled="state.disabled">
      <UIIcon v-if="iconClasses?.length" :icon="iconClasses ? iconClasses[0] : ''" :size="size || 16" />
      <span v-if="label" class="label" >{{ label }}</span>
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.button-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
}
.label {
  margin: 0 8px;
}
:deep(.n-button) {
  --n-text-color-hover: none !important;
  --n-text-color-pressed: none !important;
  --n-text-color-focus: none !important;
}

.active {
  background-color: v-bind('themeVars.buttonColor2Pressed');
}
</style>
