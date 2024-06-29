import { useUserStore } from "./modules/user"
import { useColumnStore } from "./modules/column"
import { useSubmissionStore } from "./modules/submission"

const useStore = () => ({
  userStore: useUserStore(),
  columnStore: useColumnStore(),
  submissionStore: useSubmissionStore(),
})

export default useStore