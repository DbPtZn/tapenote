import { defineStore } from 'pinia'
import type { Submission } from '~/types'
type State = {
  data: Submission[]
}
export const useSubmissionStore = defineStore('submissionStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    fetch(param: string, isOnlyShowUnparsed: boolean) {
      return $fetch<Submission[]>('/api/manage/submission/' + param, {
        method: 'post',
        body: {
          isOnlyShowUnparsed
        }
      }).then(data => {
        this.data = data
        // console.log(this.data)
      })
    }
  },
  getters: {}
})
