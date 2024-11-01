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
    <span class="close icon" />
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
  box-shadow: v-bind('themeVars.boxShadow1');
  .close {
    display: none;
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: -5px;
  }
  &:hover {
    .close {
      display: block;
    }
  }
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

.close.icon {
  color: v-bind('themeVars.iconColor');
  position: absolute;
  margin-top: 0;
  margin-left: 0;
  width: 10px;
  height: 10px;
}

.close.icon:before {
  content: '';
  position: absolute;
  top: 10px;
  width: 10px;
  height: 1px;
  background-color: currentColor;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
}

.close.icon:after {
  content: '';
  position: absolute;
  top: 10px;
  width: 10px;
  height: 1px;
  background-color: currentColor;
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
}


</style>
