<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { VNode, computed, inject, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import useStore from '@/store'
import { useDraggable } from '@vueuse/core'
import CacheCard from './private/CacheCard.vue'
import utils from '@/utils'
const { projectStore } = useStore()
const themeVars = useThemeVars()
const elementRef = ref()
const rootRef = document.body
const rect = rootRef.getBoundingClientRect()
const { x, y, style } = useDraggable(elementRef, {
  initialValue: { x: rect.width - 300, y: 100 },
  containerElement: rootRef,
  preventDefault: true, // 阻止默认事件 (阻止拖拽时选中文本)
  stopPropagation: true // 阻止冒泡
})
const data = computed(() => {
  return projectStore.data
})







</script>

<template>
  <div ref="elementRef" class="cache" :style="style">
    <div ref="warpperRef" class="wrapper">
      <div class="cache-header">
        缓存列表
        <!-- 筛选功能：选择当前用户/所有用户 -->
        <!-- 折叠/关闭 -->
      </div>
      <div class="cache-list">
        <!-- 功能：移除缓存、拖拽、跳转、排序（按更新时间） -->
        <CacheCard
          v-for="(item) in data"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :abbrev="item.abbrev"
          :date="utils.dateFormat(new Date(item.updateAt))"
        />
        <!-- 上下文菜单：跳转至文件夹、移除该缓存 -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cache {
  z-index: 999;
  position: fixed;
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid v-bind('themeVars.dividerColor');
  background-color: var(--dpz-cardColor);

  &:hover {
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: var(--dpz-scrollbarColor)
    }
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: var(--dpz-borderRadius);
  overflow: hidden;
}
.cache-header {
  font-size: 18px;
  padding: 10px 0;
  box-sizing: border-box;
}
.cache-list {
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
