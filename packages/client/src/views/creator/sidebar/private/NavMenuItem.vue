<script lang="ts" setup>
import { Component } from 'vue'
import { Icon } from '@iconify/vue'
const props = defineProps<{
  icon: string
  label: string
  active: boolean
  disabled?: boolean
}>()
</script>

<template>
  <div :class="['menu-item', active ? 'active' : '', disabled ? 'disabled' : '']">
    <!-- <n-icon class="menu-item-icon" :depth="1" :component="props.icon" :size="20" /> -->
    <Icon class="menu-item-icon" :icon="props.icon" :height="20" />
    <span class="menu-item-label">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
  cursor: pointer;
  padding: 8px 12px;
  margin: 3px 8px;
  border-radius: 4px;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: var(--dpz-buttonColorHover);
  }
}
.menu-item-icon {
  margin-right: 6px;
  pointer-events: none;
}
.menu-item-label {
  font-size: 14px;
  margin: 0 3px;
  pointer-events: none;
}
.active {
  background-color: var(--dpz-buttonColor);
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
