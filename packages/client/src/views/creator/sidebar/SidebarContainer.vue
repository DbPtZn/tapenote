<script lang="ts" setup>
import { useDialog, useMessage, useThemeVars } from 'naive-ui'
import useStore from '@/store'
import { onMounted, ref } from 'vue'
import { useShell } from '@/renderer'
import { Icon } from '@iconify/vue'
import { h } from 'vue'
import { CollapseButton } from './private'
import { CreatorShell } from '../shell'
import { GuideVideo } from './private'
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()
const shell = useShell<CreatorShell>()
const { settingStore } = useStore()
const collapseVisible = ref(false) /** 控制容器展开/折叠按钮显示 */
const methods = {
  handleCollapseSidebar() {
    settingStore.isSidebarCollapse ? shell.expandSidebar() : shell.collapseSidebar()
  }
}

onMounted(() => {
  if (localStorage.getItem('is-guide-video-played') === 'true') return
  dialog.create({
    title: '产品使用指南',
    icon: () => h(Icon, { icon: 'ep:guide', height: 24 }),
    content: () => h(GuideVideo),
    style: 'width: 50%;height: 50%;',
    positiveText: '跳过',
    maskClosable: false, 
    onPositiveClick: () => {
      message.success('感谢您的使用')
      localStorage.setItem('is-guide-video-played', 'true')
    },
    onClose() {
      message.success('感谢您的使用')
      localStorage.setItem('is-guide-video-played', 'true')
    },
  })
})

</script>
<template>
  <div class="sidebar-container" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <slot />

    <!-- 展开/折叠按钮 -->
    <CollapseButton
      v-if="collapseVisible || settingStore.isSidebarCollapse"
      :is-collapse="settingStore.isSidebarCollapse"
      @click="methods.handleCollapseSidebar"
    />
  </div>
</template>

<style lang="scss" scoped>
.pane {
  height: 50vh;
}


.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // border-left: 1px solid v-bind('themeVars.dividerColor');
  box-sizing: border-box;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  background-color:  v-bind('themeVars.bodyColor');
  // &:hover {
  //   /*定义滑块 内阴影+圆角*/
  //   ::-webkit-scrollbar-thumb {
  //     border-radius: 10px;
  //     background-color: v-bind('themeVars.scrollbarColorHover');
  //   }
  // }
}

/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// ::-webkit-scrollbar {
//   width: 6px;
//   height: 16px;
//   background-color: unset;
// }

// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   border-radius: 10px;
//   background-color: unset;
// }

// // /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   box-shadow: unset;
//   background-color: unset;
// }
</style>
