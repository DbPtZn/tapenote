<script lang="ts" setup>
import { LibraryEnum } from '@/enums'
import { CoffeeMaker, Notebook, PlayLesson } from '@/components'
import { 
  ArrowBackIosFilled, 
  AddCircleOutlineFilled, 
  WorkspacesFilled, 
  AutoAwesomeMotionOutlined,
  SearchOutlined,
  PostAddOutlined,
StickyNote2Outlined
} from '@vicons/material'
import { DropdownOption, NIcon, useThemeVars } from 'naive-ui'
import { Component, computed, h, nextTick, reactive } from 'vue'
import useStore from '@/store'
import { Footer } from '../layout'
const { recentStore } = useStore()
const themeVars = useThemeVars()
// const currentLib = computed(() => folderStore.lib)

function getCurrentLibName() {
  switch (recentStore.currentLib) {
    case LibraryEnum.NOTE:
      return '笔记'
    case LibraryEnum.COURSE:
      return '课程'
    case LibraryEnum.PROCEDURE:
      return '工程'
    default:
      return '未知'
  }
}

const dropdownState = reactive({
  lib: undefined as LibraryEnum | undefined,
  type: undefined as 'leftBtn' | 'rightBtn' | 'floatBtn' | undefined,
  target: undefined as HTMLElement | undefined,
  xRef: 0,
  yRef: 0,
  showDropdownRef: false,
  showArrowRef: false,
  placementRef: 'bottom-start' as 'bottom' | 'bottom-start' | 'bottom-end' | 'left'
})
function renderIcon(component: Component) {
  return h(NIcon, { component: component, size: 24 })
}
function handleSelectLib(lib: LibraryEnum) {
  recentStore.currentLib = lib
  if(recentStore.get.length === 0) {
    recentStore.fetchAndSet({
      lib: lib,
      skip: 0,
      take: 10
    })
  }
}
const options = computed<DropdownOption[]>(() => {
  return [
    {
      key: 'note',
      icon: () => renderIcon(Notebook),
      label: '笔记',
      show: dropdownState.type === 'floatBtn',
      props: {
        onClick: () => {
          handleSelectLib(LibraryEnum.NOTE)
        }
      }
    },
    {
      key: 'course',
      icon: () => renderIcon(PlayLesson),
      label: '课程',
      show: dropdownState.type === 'floatBtn',
      props: {
        onClick: () => {
          handleSelectLib(LibraryEnum.COURSE)
        }
      }
    },
    {
      key: 'procedure',
      icon: () => renderIcon(CoffeeMaker),
      label: '工程',
      show: dropdownState.type === 'floatBtn',
      props: {
        onClick: () => {
          handleSelectLib(LibraryEnum.PROCEDURE)
        }
      }
    },
    // Right Button
    {
      key: 'create-new-file',
      icon: () => renderIcon(PostAddOutlined),
      label: '新建项目',
      show: dropdownState.type === 'rightBtn',
      disabled: true,
      props: {
        onClick: () => {}
      }
    },
    {
      key: 'search',
      icon: () => renderIcon(SearchOutlined),
      label: '查找',
      show: dropdownState.type === 'rightBtn',
      disabled: true,
      props: {
        onClick: () => {}
      }
    }
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
  if(dropdownState.type === 'leftBtn') return dropdownState.type = undefined
  dropdownState.type = 'leftBtn'
  const target = ev.target as HTMLElement
  const rect = target.getBoundingClientRect()
  dropdownState.target = target
  nextTick().then(() => {
    dropdownState.showDropdownRef = true
    dropdownState.xRef = rect.x
    dropdownState.yRef = rect.y + 28
    dropdownState.showArrowRef = false
    dropdownState.placementRef = 'bottom-start'
  })
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

function getCurrentLibIcon(lib: LibraryEnum | undefined) {
  switch (lib) {
    case LibraryEnum.NOTE:
      return Notebook
    case LibraryEnum.COURSE:
      return PlayLesson
    case LibraryEnum.PROCEDURE:
      return CoffeeMaker
    default:
      return StickyNote2Outlined 
  }
}
function handleFloatBtnClick(ev) {
  if(dropdownState.type === 'floatBtn') return dropdownState.type = undefined
  dropdownState.type = 'floatBtn'
  const target = ev.target as HTMLElement
  const rect = target.getBoundingClientRect()
  dropdownState.target = target
  nextTick().then(() => {
    dropdownState.showDropdownRef = true
    dropdownState.xRef = rect.x
    dropdownState.yRef = rect.y + 28
    dropdownState.showArrowRef = false
    dropdownState.placementRef = 'left'
  })
}
</script>

<template>
  <div class="header">
    <div class="item leftBtn" @click="handleLeftBtnClick">
      <!-- <n-icon class="icon" :component="AutoAwesomeMotionOutlined" :size="24" /> -->
    </div>
    <div class="item title">{{ getCurrentLibName() }}</div>
    <div class="item rightBtn" @click="handleRightBtnClick">
      <n-icon class="icon" :component="AddCircleOutlineFilled" :size="24" />
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
  <n-float-button class="floatbtn" :right="-6" :bottom="150" shape="square" @click="handleFloatBtnClick">
    <n-icon class="icon" :component="getCurrentLibIcon(recentStore.currentLib)" size="24px"/>
  </n-float-button>
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
    .icon {
      pointer-events: none;
    }
  }
  .leftBtn {
    width: 24px;
  }
  .rightBtn {
    width: 24px;
  }
}
</style>
