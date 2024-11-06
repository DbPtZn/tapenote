<script lang="ts" setup>
import { ContainerTypeEnum, FractalContainerConfig, InsertType, useRenderer, useShell, FractalContainer } from '@/renderer'
import { h, onMounted, onUnmounted, ref } from 'vue'
import useStore from '@/store'
import { CreatorShell, creatorShell } from './shell'
import { NButton, NIcon, useThemeVars } from 'naive-ui'
import { LibraryEnum } from '@/enums'
// import { MenuFilled } from '@vicons/material'
import { Icon } from '@iconify/vue'
import { CacheListView } from './cache'
import { onBeforeMount } from 'vue'
const { dragStore, userStore } = useStore()
const themeVars = useThemeVars()
const renderer = useRenderer()
renderer.set(creatorShell)
const shell = useShell<CreatorShell>()
const implementRef = ref<HTMLElement>()
onBeforeMount(() => {
})
onMounted(() => {
  implementRef.value && renderer.setImplementRef(implementRef.value) // 注入实现层
  console.log('--- --- Strat container rendering --- ---')
})
onUnmounted(() => {
  console.log('--- --- Destory render page --- ---')
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
function handleContainerFocus(event, node: FractalContainerConfig) {
  if (node.type === ContainerTypeEnum.CMPT) {
    shell.workbench.setFocus({ node })
  }
}
function handleContainerRemove() {
  console.log('handleContainerRemove', dragStore.dragging && dragStore.isFile)
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
      },
      onContextmenu: (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        console.log(ev)
      }
    }, 
    {
      default: () => {
        return h(Icon, { icon:'ic:round-menu', height: 24 })
      }
    }
  )
}
</script>
<template>
  <div ref="implementRef" class="render-page" :style="{ width: renderer.getWidth, height: renderer.getHeight }">
    <FractalContainer
      :data="renderer.data" 
      :allow-container-auto-drop="!dragStore.dragging" 
      :use-aux-lines="renderer.useAuxLines"
      :mask-visible="dragStore.dragging && dragStore.isFile"
      :current-id="shell.workbench.focusId"
      :render-control="renderControl"
      :width="'100%'"
      :allow-contextmenu="true"
      @on-container-click="handleContainerFocus"
      @on-drop="handleDrop"
      @on-container-remove="handleContainerRemove"
      @on-container-contextmenu="handleContextmenu"
    />
    <CacheListView />
  </div>
</template>

<style lang="scss" scoped>
.render-page {
  display: flex;
  flex-direction: column;
  // height: v-bind('renderer.getHeight');
  // width: 100%;
  // 再加入 electron 之后出现的问题，该 css 中载入 renderer.getWidth 似乎存在生命周期的问题
  // 该问题导致在容器开始渲染时计算函数无法正确获得 100% 的容器宽度
  // 将代码移至 style 中即可解决该问题，但问题具体成因暂不明确
  // width: v-bind('renderer.getWidth');
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
