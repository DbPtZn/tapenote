<script lang="ts" setup>
import { DropdownOption, useThemeVars } from 'naive-ui'
import { computed, onMounted, reactive, ref } from 'vue'
import useStore from '@/store'
import { useDraggable } from '@vueuse/core'
import CacheCard from './private/CacheCard.vue'
import { Icon } from '@iconify/vue'
import utils from '@/utils'
import { LibraryEnum } from '@/enums'
import { CreatorShell } from '../shell'
import { useShell } from '@/renderer'
import { watch } from 'vue'
type Project = typeof projectStore.data[0]
const { projectStore, settingStore, dragStore } = useStore()
const shell = useShell<CreatorShell>()
// const themeVars = useThemeVars()
const elementRef = ref()
const dragRef = ref()
const rootRef = document.body
const rect = rootRef.getBoundingClientRect()
const isDev = import.meta.env.MODE === 'development'
const state = reactive({
  isCollapse: false,
})
const cacheState = reactive({
  limitSize: 0,
  usedSize: 0,
  totalSize: 0
})
const { x, y, style } = useDraggable(elementRef, {
  handle: dragRef,
  initialValue: { x: rect.width - 300, y: 100 },
  containerElement: rootRef,
  preventDefault: true, // 阻止默认事件 (阻止拖拽时选中文本)
  stopPropagation: true // 阻止冒泡
})
if(isDev) {
  watch(() => projectStore.data.length, () => {
    const memoryInfo = performance['memory']
    // console.log("总内存限制 (JS Heap Total):", memoryInfo.jsHeapSizeLimit / (1024 * 1024), "MB");
    // console.log("已使用内存 (JS Heap Used):", memoryInfo.usedJSHeapSize / (1024 * 1024), "MB");
    // console.log("内存占用峰值 (JS Heap Peak):", memoryInfo.totalJSHeapSize / (1024 * 1024), "MB");
    cacheState.limitSize = +(memoryInfo.jsHeapSizeLimit / (1024 * 1024)).toFixed(2)
    cacheState.usedSize = +(memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2)
    cacheState.totalSize = +(memoryInfo.totalJSHeapSize / (1024 * 1024)).toFixed(2)
  })
}
const data = computed(() => {
  return projectStore.data.slice().reverse()
})
function handleIconDbclick() {
  state.isCollapse = !state.isCollapse
}
function handleDragStart(ev: DragEvent, id: string, lib: LibraryEnum) {
  ev.dataTransfer?.setData('id', id)
  ev.dataTransfer?.setData('lib', lib)
  dragStore.dragging = true
  dragStore.isFile = true
  dragStore.lib = lib
  dragStore.isCache = true
}
function handleDragEnd(ev: DragEvent) {
  dragStore.dragging = false
  dragStore.isFile = false
  dragStore.isCache = false
  ev.dataTransfer?.clearData()
}
function handleToFile(item: Project) {
  shell.useWorkbench()
  shell.workbench.setById({ id: item.id, lib: item.lib, account: item.account, hostname: item.hostname })
}
function handleRemove(item: Project) {
  projectStore.cleanCache(item.id, item.account, item.hostname)
}
const dropdownState = reactive({
  isShow: false
})
const options: DropdownOption[] = [
  {
    label: () => `${state.isCollapse ? '展开' : '折叠'}`,
    key: 'collaspe',
    props: {
      onClick: () => {
        state.isCollapse = !state.isCollapse
      }
    }
  },
  {
    label: '关闭',
    key: 'close',
    props: {
      onClick: () => {
        settingStore.handleCacheVisible()
      }
    }
  }
]

function handleSelect() {
  dropdownState.isShow = false
}

onMounted(() => {
  setInterval(() => {
    const memoryInfo = performance['memory']
    cacheState.limitSize = +(memoryInfo.jsHeapSizeLimit / (1024 * 1024)).toFixed(2)
    cacheState.usedSize = +(memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2)
    cacheState.totalSize = +(memoryInfo.totalJSHeapSize / (1024 * 1024)).toFixed(2)
  }, 500)
})

</script>

<template>
  <div v-show="settingStore.isCacheListShow" ref="elementRef" class="cache" :style="style">
    <div ref="warpperRef" :class="['wrapper', state.isCollapse && 'collapse']">
      <div ref="dragRef" class="cache-header" @dblclick="handleIconDbclick">
        <div class="cache-header-title">
          <div>缓存列表</div>
        </div>
        <div class="cache-header-icon">
          <n-dropdown :show="dropdownState.isShow" :options="options" @clickoutside="dropdownState.isShow = false" @select="handleSelect">
            <!-- <n-icon :component="MenuRound" :size="24" /> -->
            <Icon icon="mdi:dots-vertical" height="24" @click="dropdownState.isShow = !dropdownState.isShow" />
          </n-dropdown>
        </div>
        <!-- 筛选功能：选择当前用户/所有用户 -->
        <!-- 折叠/关闭 -->
      </div>
      <div v-show="!state.isCollapse" class="cache-list">
        <!-- 功能：移除缓存、拖拽、跳转、排序（按更新时间） -->
        <CacheCard
          v-for="(item) in data"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :abbrev="item.abbrev"
          :date="utils.dateFormat(new Date(item.updateAt))"
          :active="shell.workbench.itemId === item.id"
          draggable="true"
          @dragstart="handleDragStart($event, item.id, item.lib)"
          @dragend="handleDragEnd"
          @click="handleToFile(item)"
          @on-remove="handleRemove(item)"
        />
        <!-- 上下文菜单：跳转至文件夹、移除该缓存 -->
      </div>
      <div v-if="isDev" class="cache-test">
        <li>{{ '总内存限制:' +  cacheState.limitSize + 'MB'  }}</li>
        <li>{{ '已使用内存:' + cacheState.usedSize + 'MB'  }}</li>
        <li>{{ '内存占用峰值:' + cacheState.totalSize + 'MB' }}</li>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cache {
  z-index: 999;
  position: fixed;
  // width: 280px;
  max-width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--dpz-dividerColor);
  background-color: var(--dpz-cardColor);
  opacity: 0.99;

  &:hover {
    opacity: 1;
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: var(--dpz-scrollbarColor)
    }
    .cache-header-icon {
      opacity: 0.7;
    }
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  width: 240px;
  min-width: 180px;
  height: 500px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: var(--dpz-borderRadius);
  overflow: hidden;
  resize: both;
}
.collapse {
  height: auto!important;
  // height: 70px;
  resize: none;
}
.cache-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  box-sizing: border-box;
  cursor: move;
  .cache-header-title {
    user-select: none;
    font-size: 18px;
  }
  .cache-header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s ease-in-out;
    opacity: 0.1;
    &:hover {
      opacity: 1;
    }
  }
}
.cache-list {
  // border-top: 1px solid var(--dpz-dividerColor);
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
  // margin-bottom: 50px;
}



/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  background-color: unset;
  // background-color: var(--dpz-scrollbarColor)
}
</style>
