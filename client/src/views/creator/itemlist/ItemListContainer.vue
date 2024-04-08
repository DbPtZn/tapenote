<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { ref } from 'vue'
import { CollapseButton } from './private'
import useStore from '@/store'
import { CreatorShell } from '../shell'
import { useShell } from '@/renderer'
const { settingStore } = useStore()
const shell = useShell<CreatorShell>()
const themeVars = useThemeVars()

/** 折叠/展开项目列表 */
const collapseVisible = ref(false)
const handleCollapseItemlist = () => {
  settingStore.isItemListCollapse
  ? (settingStore.isSidebarCollapse ? (shell.expandItemlist(), shell.expandSidebar()) : shell.expandItemlist())
  : (shell.collapseItemlist())
}
</script>
<template>
  <div class="itemlist-container" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <slot />
    <!-- 折叠按钮 -->
    <CollapseButton 
      v-if="collapseVisible || settingStore.isItemListCollapse" 
      :is-collapse="settingStore.isItemListCollapse" 
      @click="handleCollapseItemlist" 
    />
  </div>
</template>

<style lang="scss" scoped>

.itemlist-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  background-color:  v-bind('themeVars.bodyColor');
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
}
</style>
