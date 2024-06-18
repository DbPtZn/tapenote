<script lang="ts" setup>
import { TreeSelectOption } from 'naive-ui'
import useStore, { TreeNode } from '@/store'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { LibraryEnum } from '@/enums'
const { folderTreeStore, userStore, userListStore } = useStore()
// const isIframe = self != top // 判断是否是 iframe 模式
const props = defineProps<{
  lib: LibraryEnum
  // onUpdate?: (value: string) => void
}>()
function treeSelectOptionFormatter(option: TreeNode): TreeSelectOption {
  return {
    key: option.id,
    label: option.label,
    isLeaf: option.isLeaf,
    children: option.children?.map(o => treeSelectOptionFormatter(o))
  }
}
const emits = defineEmits<{
  onUpdateValue: [string]
}>()
function handleUpdateValue(value: string) {
  emits('onUpdateValue', value)
  // props.onUpdate && props.onUpdate(value)
}
const options = computed(() => folderTreeStore.get(props.lib).map(o => treeSelectOptionFormatter(o)))
// function getTreeData(): TreeSelectOption[] {
//   return folderTreeStore.get(props.lib).map(o => treeSelectOptionFormatter(o))
// }
// const options = ref<TreeSelectOption[]>([])
function handleLoad(node: TreeSelectOption) {
  // console.log('load')
  return new Promise<void>((resolve, reject) => {
    folderTreeStore
      .fetchChildren(node.key!.toString())
      .then(data => {
        node.children = data.map(o => treeSelectOptionFormatter(o))
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}
onMounted(() => {
  if(folderTreeStore.getTreeByLib(props.lib).length === 0) folderTreeStore.setFirstLevel(userStore.getDirByLib(props.lib), props.lib)
  // if (folderTreeStore.getTreeByLib(props.lib).length !== 0) {
  //   options.value = getTreeData()
  // } else {
  //   folderTreeStore.setFirstLevel(userStore.getDirByLib(props.lib), props.lib)?.then(() => {
  //     options.value = getTreeData()
  //   })
  // }
  // if (folderTreeStore.procedureTree.length !== 0) {
  //   options.value = getTreeData()
  // } else {
  //   folderTreeStore.setFirstLevel(userStore.getDirByLib(props.lib), props.lib)?.then(() => {
  //     options.value = getTreeData()
  //   })
  // }
})
// onUnmounted(() => {
//   console.log('destory')
// })
</script>
<template>
  <div class="folder-tree">
    <n-tree-select placeholder="选择目录" :options="options" :on-load="handleLoad" @update:value="handleUpdateValue" />
  </div>
</template>

<style lang="scss" scoped></style>


<!-- onMounted(() => {
  if (folderTreeStore.procedureTree.length !== 0) {
    options.value = getTreeData()
  } else {
    if (!isIframe) {
      folderTreeStore.setFirstLevel(userStore.getDirByLib(props.lib), props.lib)?.then(() => {
        options.value = getTreeData()
      })
    } else {
      // 在 iframe 中无法直接获取主页面的 store
      userListStore.fillInfo().then(() => {
        folderTreeStore.setFirstLevel(userStore.getDirByLib(props.lib), props.lib)?.then(() => {
          options.value = getTreeData()
        })
      })
    }
  }
}) -->