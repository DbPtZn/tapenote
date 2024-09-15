import { useUserStore } from "./modules/user"
import { useColumnStore } from "./modules/column"
import { useColumnListStore } from "./modules/column-list"
import { useSubmissionStore } from "./modules/submission"

const useStore = () => ({
  userStore: useUserStore(),
  columnStore: useColumnStore(),
  submissionStore: useSubmissionStore(),
  columnListStore: useColumnListStore()
})

export default useStore