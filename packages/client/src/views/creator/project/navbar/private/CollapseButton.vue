<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
// import { ArrowLeftFilled, ArrowRightFilled } from '@vicons/material'
import { Icon } from '@iconify/vue'
const themeVars = useThemeVars()
defineProps<{
  isCollapse: boolean
}>()
</script>

<template>
  <div :class="['collapse-btn']">
    <!-- <n-icon v-if="!isCollapse" :component="ArrowLeftFilled" /> -->
    <!-- <n-icon v-if="isCollapse" :component="ArrowRightFilled" /> -->
    <Icon :icon="isCollapse ? 'mdi:chevron-right' : 'mdi:chevron-left'" />
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  display: none!important;
}
.collapse-btn {
  position: absolute;
  top: 20px;
  right: 50%;
  transform: translateX(50%);
  transform: rotateZ(90deg);
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
