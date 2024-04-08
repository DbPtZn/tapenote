<script lang="ts" setup>
import { VNode, h, inject, nextTick, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { NButton, useThemeVars } from 'naive-ui'
import { Controller, Injector, Keymap, fromEvent } from '@textbus/core'
// import { useGetKeymapHandler, useKeymap } from './hooks/_api'
import _ from 'lodash'
import * as UUID from 'uuid'
import elementResizeDetector from 'element-resize-detector'
import { Editor } from '@textbus/editor'
import { useGetKeymapHandler, useKeymap } from './hooks'
const erd = elementResizeDetector()
const themeVars = useThemeVars()
const injector = inject<Injector>('injector')!
const controller = injector.get(Controller)
const isReadOnly = ref(false)
const sub = controller.onReadonlyStateChange.subscribe(v => {
  isReadOnly.value = v
})
const props = defineProps<{
  cmpts: VNode[]
}>()
const keymapStr = ref('')
const toolbarData = ref<VNode[]>([])
const collapseData = ref<VNode[]>([])
const boundarySequence = ref<number[]>([])
// const expandBtnLabel = ref('展开')
const collapseState = ref(false)
// const ExpandBtn = h(
//   NButton,
//   {
//     text: true,
//     block: true,
//     size: 'large'
//   },
//   { default: () => expandBtnLabel.value }
// )
function handleExpandBtnClick() {
  collapseState.value = !collapseState.value
  // expandBtnLabel.value = collapseState.value ? '折叠' : '展开'
}
const toolbarRef = ref<HTMLElement>()
const collapseRef = ref<HTMLElement>()
onBeforeMount(() => {
  toolbarData.value = props.cmpts.map(vnode => {
    vnode.key = UUID.v4()
    return vnode
  })
})

onMounted(() => {
  const widthSequence: number[] = []
  toolbarRef.value?.childNodes.forEach(node => {
    if (!['#text', '#comment'].includes(node.nodeName)) {
      const group = node as HTMLElement
      widthSequence.push(group.offsetWidth + 12)
    }
  })
  const initWidth = _.sum(widthSequence) - 12
  boundarySequence.value = widthSequence.map((item, index, arr) => {
    return initWidth - _.sum(arr.slice(arr.length - index, arr.length))
  })
  useToolbarCollapse() // 挂载完成后立即执行工具条折叠的逻辑，否则会出现溢出的按钮页面中一闪而逝的情况
  erd.listenTo(toolbarRef.value!, async () => {
    await useToolbarCollapse()
  })
  fromEvent(toolbarRef.value!, 'mouseover').subscribe((ev) => {
    const keymap = useGetKeymapHandler(ev.target as HTMLElement, toolbarRef.value!)
    if (keymap) {
      try {
        const config: Keymap = JSON.parse(keymap)
        keymapStr.value = useKeymap(config).join('+')
        return
      } catch (e) {
        console.log(e)
      }
    }
    keymapStr.value = ''
  })
})
/** 工具条折叠的逻辑 */
async function useToolbarCollapse() {
  /** 事先计算好所有按钮组的宽度和对应在工具条中的位置，当工具条缩窄时，溢出的按钮组会移入折叠工具条中 */
  for (let index = 0; index < boundarySequence.value.length; index++) {
    if (toolbarRef.value!.offsetWidth - 48 < boundarySequence.value[index]) {
      if (toolbarData.value[boundarySequence.value.length - index - 1]) {
        const vnode = toolbarData.value.pop()
        await nextTick();
        vnode && collapseData.value.unshift(vnode)
      }
    }
    else {
      /** 反之，当工具条放宽时，本来该有按钮组位置没有按钮组，就从折叠工具条中将按钮组取回 */
      if (!toolbarData.value[boundarySequence.value.length - index - 1]) {
        if (collapseData.value.length > 0) {
          const vnode = collapseData.value.shift()
          // Vue 的过渡系统是异步的，而你的移动操作是同步执行的, 同步操作会导致移动前组件的 onUnmounted 影响移动后组件的 onMounted 执行
          await nextTick() // 同步操作之后调用 nextTick, 可以确保在上一个 onUnmounted 执行完成后才执行 onMounted
          vnode && toolbarData.value.push(vnode)
          index--
        }
      }
    }
  }
}

onUnmounted(() => {
  // console.log('工具条销毁')
  if (toolbarRef.value) {
    erd.uninstall(toolbarRef.value)
  }
  sub.unsubscribe()
})

</script>

<template>
    <div ref="toolbarRef" class="custom-toolbar">
      <component class="tool-item" v-for="node in toolbarData" :key="(node.key as string)" :is="node" />
      <div :class="['expand-btn', collapseState ? 'expand-state' : '']" v-if="collapseData.length" @click="handleExpandBtnClick">
        <n-button text :color="themeVars.textColor1" size="large" :disabled="isReadOnly" >
          <n-icon :size="24">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z" fill="currentColor"></path></svg>
          </n-icon>
        </n-button>
      </div>
    </div>
    <div ref="collapseRef" class="toolbar-collapse-wrapper" v-show="collapseState && collapseData.length > 0">
      <component class="tool-item" v-for="node in collapseData" :key="(node.key as string)" :is="node" />
    </div>
    <div v-if="keymapStr" class="toolbar-keymap-prompt">
      {{ keymapStr }}
    </div>
</template>

<style lang="scss" scoped>
.expand-state {
  background-color: v-bind('themeVars.buttonColor2Hover');
}
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 34px;
  margin-left: 12px;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
  }
}
.custom-toolbar {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 6px 0px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: v-bind('themeVars.baseColor');
}
/** 工具组之间的间距 */
:deep(.group-wrapper) {
  display: flex;
  flex-direction: row;
  margin: 0 0px 0 12px;
  &:first-child {
    margin-left: 0px;
  }
}

.toolbar-collapse-wrapper {
  z-index: 100;
  position: absolute;
  padding: 6px 6px;
  top: 48px;
  right: 0;
  display: flex;
  box-shadow: 0 1px 2px rgba(0,0,0,.05);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  // animation: fadeInDown 0.3s ease-in-out;
  background-color: v-bind('themeVars.baseColor');
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.toolbar-keymap-prompt {
  position: absolute;
  right: 0;
  margin: 6px;
}

</style>
<!-- 操作 dom 的办法无法生效，因为渲染依赖于 vnode 数组，而该数组是响应式的，不改变 vnode 的情况下无法改变 dom 元素
// const nodeRefs = ref<HTMLElement[]>([]);
// const setRef = (index) => (el: HTMLElement) => {
//   // 在这里 el 就是当前 VNode 渲染后的 DOM 元素
//   // console.log([index, el])
//   nodeRefs.value[index] = el;
// }
// /** 根据挂载工具的元素条宽度计算把哪些工具组放入折叠区 */
// const collapseTools = () => {
//   for (let index = 0; index < boundarySequence.value.length; index++) {
//     if (toolbarRef.value!.offsetWidth - 48 < boundarySequence[index]) {
//       if (toolbarRef.value!.children[boundarySequence.value.length - index - 1]) {
//         collapseRef.value!.insertBefore(
//           toolbarRef.value!.children[boundarySequence.value.length - index - 1],
//           collapseRef.value!.firstChild
//         )
//       }
//     } else {
//       if (!toolbarRef.value!.children[boundarySequence.value.length - index - 1]) {
//         if (collapseRef.value!.children[0]) {
//           toolbarRef.value!.appendChild(collapseRef.value!.children[0])
//         }
//         index--
//       }
//     }
//   }
// }
// :ref="setRef(index)" -->./hooks