export * from './modules/_api'
import {
  useSettingStore,
  useTrashStore,
  useUserStore,
  useUserListStore,
  useFolderStore,
  useFolderTreeStore,
  useDragStore,
  useClipboardStore,
  useProjectStore,
  useTimbreStore
} from './modules/_api'

const useStore = () => ({
  userListStore: useUserListStore(),
  userStore: useUserStore(),
  settingStore: useSettingStore(),
  folderStore: useFolderStore(),
  folderTreeStore: useFolderTreeStore(),
  dragStore: useDragStore(),
  trashStore: useTrashStore(),
  clipboardStore: useClipboardStore(),
  projectStore: useProjectStore(),
  timbreStore: useTimbreStore()
})



export default useStore