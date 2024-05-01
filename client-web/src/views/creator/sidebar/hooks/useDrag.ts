import { LibraryEnum } from "@/enums"
import useStore, { TreeNode } from "@/store"
import { useMessage } from "naive-ui"
import { Ref, computed, reactive, ref, watch } from "vue"

export function useDrag(sidebarRef: Ref<HTMLElement | undefined>) {
  const { dragStore, projectStore, folderStore, folderTreeStore, userStore } = useStore()
  const message = useMessage()
  const account = computed(() => userStore.account)
  const hostname = computed(() => userStore.hostname)
  const dragState = reactive({
    show: computed(() => dragStore.dragging),
    xRef: 0,
    yRef: 0,
    widthRef: 0,
    heightRef: 0
  })
  watch(() => dragStore.dragging, (state) => {
    if (!state) {
      dragState.xRef = 0
      dragState.yRef = 0
      dragState.widthRef = 0
      dragState.heightRef = 0
    }
  })
  const dropTarget = ref<TreeNode | null>(null)
  function handleDragEnter(option: TreeNode, event: DragEvent) {
    if (option.lib !== dragStore.lib) return // 禁止移动到不同库的目录下
    let target = event.target as HTMLElement
    while (target) {
      // console.log('for')
      if (target.classList.contains('n-tree-node')) {
        dropTarget.value = option
        const rect = target.getBoundingClientRect()
        dragState.widthRef = rect.width
        dragState.heightRef = rect.height
        dragState.xRef = rect.x - sidebarRef.value!.getBoundingClientRect().left
        dragState.yRef = rect.y
        break
      }
      if (target === sidebarRef.value) {
        break
      }
      target = target.parentElement as HTMLElement
    }
  }
  function handleDragLeave() {
    dragState.xRef = 0
    dragState.yRef = 0
    dragState.widthRef = 0
    dragState.heightRef = 0
  }
  function handleDrop(event: DragEvent) {
    if (dragStore.isCache) {
      message.error('不能操作缓存项目！')
      handleDragLeave()
      return
    }
    if (dragStore.isFile) {
      const fileId = event.dataTransfer?.getData('id')
      const lib = event.dataTransfer?.getData('lib') as LibraryEnum
      const folderId = dropTarget.value?.id
      const targetLib = dropTarget.value?.lib
      if (folderStore.id === folderId) return
      if (lib !== targetLib) {
        message.error('不能移动到不同库的文件夹！')
      }
      if (folderId && fileId && lib) {
        moveFile(fileId, folderId, lib, account.value, hostname.value)
      }
    } else {
      const sourceId = event.dataTransfer?.getData('folderId')
      const lib = event.dataTransfer?.getData('lib') as LibraryEnum
      const targetId = dropTarget.value?.id
      if (sourceId === targetId) return
      if (folderStore.id === targetId) return
      if (sourceId && targetId && lib) {
        moveFolder(sourceId, targetId, lib)
      }
    }
  }

  function moveFile(fileId: string, folderId, lib: LibraryEnum, account: string, hostname: string) { 
    projectStore.move(fileId, folderId, account, hostname).then(() => {
      if (folderStore.id === 'recently') return
      folderStore.removeSubfileById(fileId)
    })
  }
  function moveFolder(sourceId: string, targetId: string, lib: LibraryEnum) {
    if (sourceId === targetId) {
      message.warning('不能将节点移动到自身')
      return 
    }
         // 将节点移入子节点会导致节点失去上级索引，问题比较严重，所以前后端都进行了防御性检查以确保安全
    const isAncestor = folderTreeStore.isAncestorNode(sourceId, targetId, lib)
    if (isAncestor) {
      message.warning('不能将节点移动到子节点中')
      return
    }
    folderTreeStore.moveFolder({ sourceId, targetId, dropPosition: 'inside'}).then(() => {
      folderStore.removeSubfolderById(sourceId)
      folderTreeStore.manualMoveInside(sourceId, targetId, lib)
    }).catch(err => {
      message.error('移动失败')
    })
  }
  
  function getNodeProps(info: { option: TreeNode }) {
    const { option } = info
    return {
      draggable: true,
      ondragenter: ev => handleDragEnter(option, ev),
    }
  }

  return {
    dragState,
    getNodeProps,
    handleDragLeave,
    handleDrop,
  }
}