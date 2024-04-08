<script lang="ts" setup>
import { ContainerTypeEnum, FractalContainerConfig, InsertType, useRendererStore, useShell, FractalContainer } from '@/renderer'
import { h, onMounted, onUnmounted, ref } from 'vue'
import useStore from '@/store'
import { CreatorShell, creatorShell } from './shell'
import { NButton, NIcon, useThemeVars } from 'naive-ui'
import { LibraryEnum } from '@/enums'
import { MenuFilled } from '@vicons/material'
const { dragStore, userStore } = useStore()
const themeVars = useThemeVars()
const rendererStore = useRendererStore()
rendererStore.set(creatorShell)
const shell = useShell<CreatorShell>()
const implementRef = ref<HTMLElement>()
onMounted(() => {
  implementRef.value && rendererStore.setImplementRef(implementRef.value) // 注入实现层
  console.log('!--- ---启动分形容器渲染--- ---!')
})
onUnmounted(() => {
  // console.log('destory render page')
})
function handleDrop(ev: DragEvent, targetNode: FractalContainerConfig, targetNodeParent: FractalContainerConfig, index: number, insertType: InsertType, isAutoDrop: boolean) {
  if (isAutoDrop) return // 如果内部 drop 逻辑已经处理，就不要再用外部 drop 逻辑处理
  const itemId = ev.dataTransfer?.getData('id')
  const lib = ev.dataTransfer?.getData('lib') as LibraryEnum
  // 查询 url 地址是否已打开, 若打开，将焦点聚焦到对应窗口上
  if (!itemId || !lib) return // 判断拖拽对象是否存在
  const vnode = shell.workbench.createCmptNode({ id: itemId, lib, account: userStore.account, hostname: userStore.hostname })// 生成虚拟项目
  const instance = shell.workbench.queryInstance(itemId, lib) // 查询对应项目是否已经实例化
  if (instance) {
    shell.workbench.setFocus({ node: instance })
    return
  }
  shell.workbench.insertNode(vnode, targetNode, targetNodeParent, index, insertType)
  shell.workbench.setFocus({ node: vnode })
}
function handleIframeFocus(containerId: string) {
  shell.workbench.setFocus({ containerId: containerId })
}
function handleContainerFocus(event, node: FractalContainerConfig) {
  if (node.type === ContainerTypeEnum.CMPT) {
    shell.workbench.setFocus({ node })
  }
}
function handleContainerRemove() {
  const firstContainer = shell.workbench.findFirstNodeByType(ContainerTypeEnum.CMPT)
  firstContainer ? shell.workbench.setFocus({ node: firstContainer }) : shell.workbench.clearFocus()
  // shell.workbench.setPersist(shell.workbench.data)
}
function handleContextmenu(ev: MouseEvent, node: FractalContainerConfig) {
  if(ev.altKey) {
    console.log(ev)
    console.log(node)
  }
}
function renderControl({ options }: { options: FractalContainerConfig }) {
  return h(NButton,
    { 
      text: true,
      style: {
        zIndex: 2,
        position: 'absolute',
        top: '8px',
        left: '8px',
        color: options.id === shell.workbench.focusId ? themeVars.value.textColor1 : themeVars.value.textColor3
      }
    }, 
    {
      default: () => {
        return h(NIcon, { component: MenuFilled, size: 24 })
      }
    }
  )
}
</script>
<template>
  <div ref="implementRef" class="render-page">
    <FractalContainer
      :data="rendererStore.data" 
      :allow-container-auto-drop="!dragStore.dragging" 
      :use-aux-lines="rendererStore.useAuxLines"
      :mask-visible="dragStore.dragging && dragStore.isFile"
      :current-id="shell.workbench.focusId"
      :render-control="renderControl"
      :width="'100%'"
      :allow-contextmenu="true"
      @on-container-click="handleContainerFocus"
      @on-iframe-focus="handleIframeFocus"
      @on-drop="handleDrop"
      @on-container-remove="handleContainerRemove"
      @on-container-contextmenu="handleContextmenu"
    />
  </div>
</template>

<style lang="scss" scoped>
.render-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: v-bind('rendererStore.getHeight');
  width: v-bind('rendererStore.getWidth');
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
