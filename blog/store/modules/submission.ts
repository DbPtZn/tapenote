import { defineStore } from 'pinia'
import type { GetArticleDto } from '~/dto'
import type { ArticlePaginateResult, Submission, SubmissionState } from '~/types'
type State = SubmissionState
export const useSubmissionStore = defineStore('submissionStore', {
  state(): State {
    return {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 0,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: 0
    }
  },
  actions: {
    fetch(dto: GetArticleDto) {
      return $fetch<ArticlePaginateResult>('/api/manage/submission', {
        method: 'post',
        body: dto
      }).then(result => {
        this.$patch(result)
        console.log(this.$state)
      })
    }
  },
  getters: {}
})
