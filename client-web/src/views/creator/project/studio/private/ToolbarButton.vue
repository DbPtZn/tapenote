<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
defineProps<{
  icon: string
  size?: number
  color?: string
}>()
const themeVars = useThemeVars()
</script>

<template>
  <div class="toolbar-btn">
    <n-button class="btn" block text>
      <DpzIcon :icon="icon" :size="size || 24" :color="color" />
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-btn {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 4px 2px 2px;
  border-radius: 3px;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
}
</style>
