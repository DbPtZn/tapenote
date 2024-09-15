<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useThemeVars } from 'naive-ui'
import { ArrowLeftFilled, ArrowRightFilled } from '@vicons/material'
import useStore from '@/store'
const emits = defineEmits<{
  collapse: [boolean]
}>()
defineProps<{
  width: number
}>()
const { settingStore } = useStore()
const themeVars = useThemeVars()
const isCollapse = computed(() => settingStore.isNavbarCollapse)
const collapseVisible = ref(false)
function handleCollapse(is: boolean){
  emits('collapse', is)
}
</script>

<template>
  <div :class="['container']" :style="{ width: width + 'px' }" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <div :class="['content',isCollapse && 'collapse']">
      <slot />
    </div>

    <!-- 展开/折叠按钮 -->
    <div v-if="collapseVisible || isCollapse" class="collapse-btn" @click="handleCollapse(!isCollapse)">
      <n-icon v-if="!isCollapse" :component="ArrowLeftFilled" />
      <n-icon v-if="isCollapse" :component="ArrowRightFilled" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse {
  width: 0;
  overflow: hidden;
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.container {
  z-index: 1000;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  box-sizing: border-box;
}
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
