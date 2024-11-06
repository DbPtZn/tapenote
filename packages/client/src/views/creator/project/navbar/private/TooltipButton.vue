<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { Component } from 'vue'
import { DpzButton } from '@/components'
defineProps<{
  icon: Component
  tip: string,
  active?: boolean
  disabled?: boolean
}>()
const themeVars = useThemeVars()
</script>

<template>
  <div>
    <n-tooltip trigger="hover" :disabled="disabled">
      <template #trigger>
        <DpzButton text :class="['btn', active && 'active']" :disabled="disabled">
          <n-icon :component="icon" :size="22" />
        </DpzButton>
      </template>
      {{ tip }}
    </n-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  // padding: 3px;
  display: flex;
  align-items: center;
}

.active {
  // padding: 3px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: v-bind('themeVars.buttonColor2');
}

:deep(.n-button) {
  --n-text-color-hover: none !important;
  --n-text-color-pressed: none !important;
  --n-text-color-focus: none !important;
}

</style>
