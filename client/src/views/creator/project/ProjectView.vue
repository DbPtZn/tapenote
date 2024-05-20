<script lang="ts" setup>
import { FractalContainerConfig, FractalContainer, useShell } from '@/renderer'
import utils from '@/utils'
import { Editor } from './editor'
import { Studio } from './studio'
import { Navbar } from './navbar'
import { computed, h, markRaw, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import useStore from '@/store'
import { Bridge } from './bridge'
import { LibraryEnum } from '@/enums'
import { Sidenote } from './sidenote'
import { CreatorShell } from '../shell'
import { useThemeVars } from 'naive-ui'
import elementResizeDetector from 'element-resize-detector'

const { projectStore, userStore, speakerStore } = useStore()
const shell = useShell<CreatorShell>()
// watch(() => shell.workbench.itemId, (newVal, oldVal) => {
//   console.log(newVal)
// })
const erd = elementResizeDetector()
const themeVars = useThemeVars()
const implementRef = ref()
const bridge = new Bridge()
const isReadonly = ref(false)
provide('bridge', bridge)

const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
}>()

const containerId = {
  wrapper: utils.randomString(),
  header: utils.randomString(),
  main: utils.randomString(),
  editor: utils.randomString(),
  studio: utils.randomString(),
  sidenote: utils.randomString(),
}
const sidenote = ref<FractalContainerConfig>()
const editor = ref<FractalContainerConfig>()
const data = reactive<FractalContainerConfig>({
  id: containerId.wrapper,
  type: 'wrapper',
  name: `project-${containerId.wrapper}`,
  cmpt: null,
  isRow: false,
  children: [
    {
      id: containerId.header,
      type: 'layout',
      name: `project-header-${containerId.header}`,
      cmpt: markRaw(h(Navbar, { id: props.id, lib: props.lib, account: props.account, hostname: props.hostname, readonly: () => isReadonly.value })),
      isRow: true,
      ratio: '42px',
      min: '42px',
      children: []
    },
    {
      id: containerId.main,
      type: 'layout',
      name: `project-main-${containerId.main}`,
      isRow: true,
      children: [
        (editor.value = {
          id: containerId.editor,
          type: 'component',
          name: `project-editor-${containerId.editor}`,
          cmpt: markRaw(h(Editor, { id: props.id, lib: props.lib, account: props.account, hostname: props.hostname, readonly: () => isReadonly.value })),
          isRow: true,
          ratio: props.lib === LibraryEnum.PROCEDURE ? 70 : 100,
          min: 20,
          children: []
        }),
        props.lib === LibraryEnum.PROCEDURE ? {
          id: containerId.studio,
          type: 'component',
          name: `project-studio-${containerId.studio}`,
          cmpt: markRaw(h(Studio, { id: props.id, lib: props.lib, account: props.account, hostname: props.hostname, focus: () => shell.workbench.itemId === props.id, readonly: () => isReadonly.value })),
          isSplitterRender: true,
          isRow: true,
          ratio: 30,
          min: 20,
          children: []
        } : undefined,
        props.lib === LibraryEnum.COURSE ? (sidenote.value = {
          id: containerId.sidenote,
          type: 'component',
          name: `course-sidenote-${containerId.sidenote}`,
          cmpt: markRaw(h(Sidenote, { id: props.id, lib: props.lib, account: props.account, hostname: props.hostname, readonly: () => isReadonly.value })),
          isSplitterRender: true,
          isRow: true,
          ratio: 0,
          min: 0,
          children: []
        }) : undefined
      ].filter(item => item) as FractalContainerConfig[]
    }
  ]
})
const subs = [
  bridge.onEditorReady.subscribe(() => {
    isReadonly.value = userStore.hostname !== projectStore.get(props.id!)?.hostname || userStore.account !== projectStore.get(props.id!)?.account
  })
]

if(props.lib === LibraryEnum.COURSE) {
  subs.push(
    bridge.onSidenoteShow.subscribe((isShow) => {
      if(isShow) {
        editor.value!.ratio = 50
        sidenote.value!.ratio = 50
        sidenote.value!.isSplitterRender = true
        return
      }
      editor.value!.ratio = 100
      sidenote.value!.ratio = 0
      sidenote.value!.isSplitterRender = false
    }),
    bridge.onSidenoteReady.subscribe(() => {
      // 首加载在数据载入完成后再判断是否需要修改为只读模式
      isReadonly.value = userStore.hostname !== projectStore.get(props.id!)?.hostname || userStore.account !== projectStore.get(props.id!)?.account
    })
  )
}

/** 监听当前用户变更 */
watch(() => [userStore.hostname, userStore.account], () => {
  isReadonly.value = userStore.hostname !== projectStore.get(props.id!)?.hostname || userStore.account !== projectStore.get(props.id!)?.account
})

/** 当项目不存在时，移除对应的容器页面 */
watch(() => projectStore.get(props.id), () => {
  const item = projectStore.get(props.id)
  if (!item) {
    shell.workbench.findNodeByNameAndRemove(props.id)
    shell.workbench.clearFocus()
  }
})
const resizeVal = ref(0)
onMounted(() => {
  bridge.projectRef = implementRef.value
  erd.listenTo(implementRef.value, () => {
    resizeVal.value = implementRef.value.clientHeight + implementRef.value.clientWidth
  })
})

onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
  if (implementRef.value) {
    erd.uninstall(implementRef.value)
  }
})
</script>
<template>
  <div ref="implementRef" class="project">
    <n-loading-bar-provider>
      <FractalContainer class="fractal-container" :data="data" :height="'100%'" :width="'100%'" :resizing="resizeVal" />
    </n-loading-bar-provider>
  </div>
</template>

<style lang="scss" scoped>
.project {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; // 处理边框被遮挡的问题
  box-sizing: border-box;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  border-right: 1px solid v-bind('themeVars.dividerColor');
  .fractal-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
