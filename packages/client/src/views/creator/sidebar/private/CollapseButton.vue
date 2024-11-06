<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { Icon } from '@iconify/vue'
const themeVars = useThemeVars()
defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  },
  top: {
    type: Number,
    default: 200
  }
})
</script>

<template>
  <div class="collapse-btn">
    <Icon :icon="!isCollapse ? 'mdi:chevron-left' : 'mdi:chevron-right'" />
  </div>
</template>

<style lang="scss" scoped>
.collapse-btn {
  position: absolute;
  right: -7px;
  top: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 14px;
  animation: fadeIn 1s ease-in-out;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;
  background-color: v-bind('themeVars.buttonColor2');
  cursor: pointer;
  z-index: 1000;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
}
</style>
