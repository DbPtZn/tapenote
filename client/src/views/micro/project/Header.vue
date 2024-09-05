<script lang="ts" setup>
import { LibraryEnum, RoutePathEnum } from '@/enums'
import { CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { 
  ArrowBackIosFilled, 
  AddCircleOutlineFilled, 
  WorkspacesFilled, 
  AutoAwesomeMotionOutlined,
  SearchOutlined,
  PostAddOutlined,
  MoreHorizFilled,
  StickyNote2Outlined,
  KeyboardArrowLeftFilled
} from '@vicons/material'
import { DropdownOption, NIcon, useThemeVars } from 'naive-ui'
import { Component, computed, h, nextTick, onMounted, reactive, ref } from 'vue'
import useStore from '@/store'
import router from '@/router'
const { folderStore, userStore } = useStore()
const themeVars = useThemeVars()

const dropdownState = reactive({
  lib: undefined as LibraryEnum | undefined,
  type: undefined as 'leftBtn' | 'rightBtn' | 'floatBtn' | undefined,
  target: undefined as HTMLElement | undefined,
  xRef: 0,
  yRef: 0,
  showDropdownRef: false,
  showArrowRef: false,
  placementRef: 'bottom-start' as 'bottom' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end'
})
function renderIcon(component: Component) {
  return h(NIcon, { component: component, size: 24 })
}


const options = computed<DropdownOption[]>(() => {
  return [
    //
  ]
})

const dropdownMethods = {
  handleClickOutside(ev: Event) {
    // 阻止冒泡：实现再点击一次关闭下拉列表
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    dropdownState.type = undefined
  },
  handleSelect() {
    dropdownState.showDropdownRef = false
    dropdownState.type = undefined
  }
}

const handleLeftBtnClick = (ev: MouseEvent) => {
  router.back()
}
const handleRightBtnClick = (ev: MouseEvent) => {
  if(dropdownState.type === 'rightBtn') return dropdownState.type = undefined
  dropdownState.type = 'rightBtn'
  const target = ev.target as HTMLElement
  const rect = target.getBoundingClientRect()
  dropdownState.target = target
  nextTick().then(() => {
    dropdownState.showDropdownRef = true
    dropdownState.xRef = rect.x + 20
    dropdownState.yRef = rect.y + 28
    dropdownState.showArrowRef = false
    dropdownState.placementRef = 'bottom-end'
  })
}


// function handleFloatBtnClick(ev) {
//   if(dropdownState.type === 'floatBtn') return dropdownState.type = undefined
//   dropdownState.type = 'floatBtn'
//   const target = ev.target as HTMLElement
//   const rect = target.getBoundingClientRect()
//   dropdownState.target = target
//   nextTick().then(() => {
//     dropdownState.showDropdownRef = true
//     dropdownState.xRef = rect.x
//     dropdownState.yRef = rect.y + 28
//     dropdownState.showArrowRef = false
//     dropdownState.placementRef = 'left'
//   })
// }

</script>

<template>
  <div class="header">
    <div class="item leftBtn" @click="handleLeftBtnClick">
      <n-icon class="icon" :component="KeyboardArrowLeftFilled" :size="24" />
    </div>
    <div class="item title">
      <span> </span>
    </div>
    <div class="item rightBtn" @click="handleRightBtnClick">
      <n-icon class="icon" :component="MoreHorizFilled" :size="24" />
    </div>
  </div>
  <!-- 右击下拉列表 -->
  <n-dropdown
    trigger="manual"
    :placement="dropdownState.placementRef"
    :show-arrow="dropdownState.showArrowRef"
    :x="dropdownState.xRef"
    :y="dropdownState.yRef"
    :options="options"
    :show="dropdownState.showDropdownRef"
    @select="dropdownMethods.handleSelect"
    @clickoutside="dropdownMethods.handleClickOutside"
  />
  <!-- <n-float-button class="floatbtn" :right="-6" :bottom="150" shape="square" @click="handleFloatBtnClick">
    <n-icon class="icon" :component="getCurrentLibIcon(folderStore.lib)" size="24px"/>
  </n-float-button> -->
</template>

<style lang="scss" scoped>
.header {
  height: 55px;
  min-height: 55px;
  background-color: v-bind('themeVars.cardColor');
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  .item {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .leftBtn {
    width: 48px;
  }
  .rightBtn {
    width: 24px;
  }
}
.icon {
  pointer-events: none;
}
</style>
