<script lang="ts" setup>
import { TreeSelectOption } from 'naive-ui'
import useStore, { TreeNode } from '@/store'
import { onMounted, onUnmounted, ref, watch } from 'vue'
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
  select: [string]
}>()
function handleUpdateValue(value: string) {
  emits('onUpdateValue', value)
}
function getTreeData(): TreeSelectOption[] {
  return folderTreeStore.get(props.lib).map(o => treeSelectOptionFormatter(o))
}
/** 只应该用 ref 而不能用 computed, 因为 TreeSelect 内是有副作用的 */
const options = ref<TreeSelectOption[]>([])
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
/** 监听目录变化，更新 tree */
watch(() => folderTreeStore.get(props.lib), () => {
  options.value = getTreeData()
}, {
  deep: true
})
onMounted(() => {
  if (folderTreeStore.getTreeByLib(props.lib).length !== 0) {
    options.value = getTreeData()
  } else {
    folderTreeStore.setFirstLevel(userStore.getDirByLib(props.lib), props.lib)?.then(() => {
      options.value = getTreeData()
    })
  }
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