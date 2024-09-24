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
  useSpeakerStore,
  useMicroStore,
  useRecentStore,
  useStudioStore
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
  speakerStore: useSpeakerStore(),
  microStore: useMicroStore(),
  recentStore: useRecentStore(),
  studioStore: useStudioStore()
})



export default useStore
