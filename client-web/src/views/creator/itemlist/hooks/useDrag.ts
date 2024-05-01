import { LibraryEnum } from "@/enums"
import useStore, { Subfolder } from "@/store"
import { useMessage } from "naive-ui"
import { computed } from "vue"

export function useDrag() {
  const { dragStore, folderStore, folderTreeStore, userStore, projectStore } = useStore()
  const message = useMessage()
  const account = computed(() => userStore.account)
  const hostname = computed(() => userStore.hostname)
  // const dragState = reactive({
  //   show: computed(() => dragStore.dragging)
  // })
  function handleFolderDragStart(ev: DragEvent, folder: Subfolder) {
    ev.dataTransfer?.setData('folderId', folder.id)
    ev.dataTransfer?.setData('lib', folderStore.lib!)
    dragStore.dragging = true
    dragStore.lib = folderStore.lib!
  }
  function handleFolderDragEnd(ev: DragEvent) {
    dragStore.dragging = false
    ev.dataTransfer?.clearData()
  }
  function handleDragEnter(ev: DragEvent) {
    //
  }
  function handleDragLeave(ev: DragEvent) {
    //
  }
  function handleDrop(ev: DragEvent, folder: Subfolder) {
    if (dragStore.isCache) {
      message.error('不能操作缓存项目！')
      // handleDragLeave()
      return
    }
    if (dragStore.isFile) {
      const fileId = ev.dataTransfer?.getData('id')
      const lib = ev.dataTransfer?.getData('lib') as LibraryEnum
      const folderId = folder.id
      // 相同文件夹不需要移动
      if (folderStore.id === folderId) return
      if (lib !== folder.lib) {
        message.error('不能移动到不同库的文件夹！')
      }
      if (folderId && fileId && lib) {
        moveFile(fileId, folderId, lib, account.value, hostname.value)
      }
    } else {
      const sourceId = ev.dataTransfer?.getData('folderId')
      const lib = ev.dataTransfer?.getData('lib') as LibraryEnum
      const targetId = folder.id
      if (sourceId === targetId) return
      if (folderStore.id === targetId) return
      if (sourceId && targetId && lib) {
        moveFolder(sourceId, targetId, lib)
      }
    }
  }

  function moveFile(fileId: string, folderId: string, lib: LibraryEnum, account: string, hostname: string) { 
    projectStore.move(fileId, folderId, account, hostname).then(() => {
      folderStore.removeSubfileById(fileId)
    })
    // switch (lib) {
    //   case LibraryEnum.NOTE:
    //     noteStore.move(fileId, folderId, account, hostname).then(() => {
    //       folderStore.removeSubfileById(fileId)
    //     })
    //     break
    //   case LibraryEnum.COURSE:
    //     courseStore.move(fileId, folderId, account, hostname).then(() => {
    //       folderStore.removeSubfileById(fileId)
    //     })
    //     break
    //   case LibraryEnum.PROCEDURE:
    //     procedureStore.move(fileId, folderId, account, hostname).then(() => {
    //       folderStore.removeSubfileById(fileId)
    //     })
    //     break
    // }
  }

  function moveFolder(sourceId: string, targetId: string, lib: LibraryEnum) {
    if (sourceId === targetId) return
    const isAncestor = folderTreeStore.isAncestorNode(sourceId, targetId, lib)
    if (isAncestor) {
      message.warning('不能将节点移动到子节点中')
      return
    }
    folderTreeStore.moveFolder({ sourceId, targetId, dropPosition: 'inside'}).then(() => {
      folderStore.removeSubfolderById(sourceId)
      folderTreeStore.manualMoveInside(sourceId, targetId, lib)
    })
  }
  
  return {
    handleFolderDragStart,
    handleFolderDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  }
}