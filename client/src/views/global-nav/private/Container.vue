<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useThemeVars } from 'naive-ui'
import { ArrowLeftFilled, ArrowRightFilled } from '@vicons/material'
const emits = defineEmits<{
  collapse: [number]
}>()
const themeVars = useThemeVars()
const isCollapse = ref(false)
const collapseVisible = ref(false)
const widthVal = ref(64)
const isDefaultCollape = import.meta.env.VITE_COLLAPSE_SIDER === 'true'
onMounted(() => {
  if(!isCollapse.value) emits('collapse', widthVal.value)
  isDefaultCollape && handleCollapse()
})
function handleCollapse(){
  isCollapse.value = !isCollapse.value
  widthVal.value = isCollapse.value ? 0 : 64
  emits('collapse', widthVal.value)
  // collapseVisible.value = !collapseVisible.value
}
</script>

<template>
  <div :class="['container']" :style="{ width: widthVal + 'px' }" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <div :class="['content',isCollapse && 'collapse']">
      <slot />
    </div>

    <!-- 展开/折叠按钮 -->
    <div v-if="collapseVisible || isCollapse" class="collapse-btn" @click="handleCollapse">
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
