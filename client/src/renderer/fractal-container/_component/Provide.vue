<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { FractalContainerConfig, ContainerTypeEnum } from '..'
const props = defineProps<{
  node: FractalContainerConfig
  parent: FractalContainerConfig
}>()
const child = ref(props.node)
const elementRef = ref<HTMLElement>()
onMounted(() => {
  child.value = props.node
  // 赋能 child 查询 parent 的能力
  child.value.parent = props.parent
  // 赋能节点查询自身 Dom 的能力
  child.value.element = (elementRef.value?.parentElement as HTMLElement) || null
  /** 自检测：移除空容器 */
  if (child.value.type === ContainerTypeEnum.SIMPLE && child.value.children.length === 0) {
    console.log('移除空容器')
    child.value.parent.children.splice(child.value.parent.children.findIndex(item => item.id === child.value.id), 1)
  }
  /** 
    // 非必要的嵌套节点在数据变化时并没有被重新渲染所以无法在此处触发自检测
    if (child.value.name === ContainerTypeEnum.SIMPLE && child.value.children.length === 1) {
      child.value.parent.children.forEach((item, index, arr) => {
        if (item.id === child.value.id) {
          arr.splice(index, 1, ...child.value.children)
        }
      })
    }
  */
  // eslint-disable-next-line vue/no-mutating-props
  // props.node.parent = props.parent
})
</script>

<template>
  <div ref="elementRef"></div>
</template>
