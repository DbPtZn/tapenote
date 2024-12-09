<script lang="ts" setup>
import { useShell } from '@/renderer'
import { Editor } from './editor'
import { Studio } from './studio'
import { Navbar } from './navbar'
import { onErrorCaptured, onMounted, onUnmounted, provide,  ref, watch } from 'vue'
import useStore from '@/store'
import { Bridge } from './bridge'
import { LibraryEnum } from '@/enums'
import { CreatorShell } from '../shell'
import { useThemeVars } from 'naive-ui'
import elementResizeDetector from 'element-resize-detector'
import utils from '@/utils'

const { projectStore, userStore } = useStore()
const shell = useShell<CreatorShell>()
// const erd = elementResizeDetector()
const themeVars = useThemeVars()
const implementRef = ref()
const bridge = new Bridge()
const isReadonly = ref(false)
const key = ref(utils.randomString())

provide('bridge', bridge)

const props = defineProps<{
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
}>()

const subs = [
  bridge.onEditorReady.subscribe(() => {
    isReadonly.value = userStore.hostname !== projectStore.get(props.id!)?.hostname || userStore.account !== projectStore.get(props.id!)?.account
  }),
  bridge.onEditorReload.subscribe(() => {
    // console.log('editor reload')
    key.value = utils.randomString()
    // editor.value!.key = utils.randomString()
  })
]

// if (props.lib === LibraryEnum.COURSE) {
//   subs.push(
//     bridge.onSidenoteShow.subscribe(isShow => {
//       if (isShow) {
//         editor.value!.ratio = 50
//         sidenote.value!.ratio = 50
//         sidenote.value!.isSplitterRender = true
//         return
//       }
//       editor.value!.ratio = 100
//       sidenote.value!.ratio = 0
//       sidenote.value!.isSplitterRender = false
//     }),
//     bridge.onSidenoteReady.subscribe(() => {
//       // 首加载在数据载入完成后再判断是否需要修改为只读模式
//       isReadonly.value = userStore.hostname !== projectStore.get(props.id!)?.hostname || userStore.account !== projectStore.get(props.id!)?.account
//     })
//   )
// }

/** 监听当前用户变更 */
watch(
  () => [userStore.hostname, userStore.account],
  () => {
    isReadonly.value = userStore.hostname !== projectStore.get(props.id!)?.hostname || userStore.account !== projectStore.get(props.id!)?.account
  }
)

/** 当项目不存在时，移除对应的容器页面 */
watch(
  () => projectStore.get(props.id),
  () => {
    const item = projectStore.get(props.id)
    if (!item) {
      shell.workbench.findNodeByNameAndRemove(props.id)
      shell.workbench.clearFocus()
    }
  }
)
// const resizeVal = ref(0)
onMounted(() => {
  bridge.projectEl = implementRef.value
  // erd.listenTo(implementRef.value, () => {
  //   resizeVal.value = implementRef.value.clientHeight + implementRef.value.clientWidth
  // })
})

onUnmounted(() => {
  subs.forEach(sub => sub.unsubscribe())
  bridge.destory()
  // data.children.length = 0
  // data.children = []
  // if (implementRef.value) {
  //   erd.uninstall(implementRef.value)
  // }
})

onErrorCaptured(e => {
  console.log('error', e)
})
</script>
<template>
  <div ref="implementRef" class="project">
    <div style="height: 42px">
      <component :is="Navbar" :id="id" :lib="lib" :account="account" :hostname="hostname" :readonly="isReadonly" />
    </div>
    <div class="workbench">
      <n-split
        direction="horizontal"
        :default-size="lib === LibraryEnum.PROCEDURE ? 0.7 : 1"
        :disabled="lib !== LibraryEnum.PROCEDURE"
        :max="0.75"
        :min="0.25"
        :resize-trigger-size="1"
      >
        <template #1>
          <component :key="key" :is="Editor" :id="id" :lib="lib" :account="account" :hostname="hostname" :readonly="isReadonly" :focus="shell?.workbench?.itemId === id" />
        </template>
        <template #2>
          <component
            v-if="lib === LibraryEnum.PROCEDURE"
            :is="Studio"
            :id="id"
            :lib="lib"
            :account="account"
            :hostname="hostname"
            :readonly="isReadonly"
            :focus="shell?.workbench?.itemId === id"
          />
        </template>
      </n-split>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project {
  position: relative;
  display: flex;
  flex-direction: column;
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

  .navbar {
    height: 42px;
    min-height: 42px;
  }
  :deep(.n-split__resize-trigger-wrapper) {
    z-index: 1;
    opacity: 0.5;
  }
  .workbench {
    height: calc(100% - 42px);
  }
}
</style>
