<script lang="ts" setup>
import { VNode, computed } from 'vue'
import { useThemeVars } from 'naive-ui'
// import { Injector, Keymap, fromEvent } from '@textbus/core'
import _ from 'lodash'
import * as UUID from 'uuid'
// import elementResizeDetector from 'element-resize-detector'
// const erd = elementResizeDetector()
const themeVars = useThemeVars()
// const injector = inject<Injector>('injector')
const props = defineProps<{
  cmpts: VNode[]
}>()
const toolbarData = computed(() => {
  return props.cmpts.map(item => {
    item.key = UUID.v4()
    return item
  })
})
</script>

<template>
  <div ref="toolbarRef" class="inline-toolbar">
    <component class="tool-item" v-for="node in toolbarData" :key="node.key" :is="node" />
  </div>
</template>

<style lang="scss" scoped>
// :deep(.textbus-fast-toolbar) {
//   position: absolute;
//   text-align: center;
//   transition: all 0.2s ease-in-out;
// }
// .correct {
//   // margin-top: -50px;
// }
.inline-toolbar {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 6px 6px;
  border-radius: 6px;
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
</style>
