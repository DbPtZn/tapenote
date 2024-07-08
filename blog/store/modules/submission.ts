import { defineStore } from 'pinia'
import type { GetArticleDto } from '~/dto'
import type { ArticlePaginateResult, Submission, SubmissionState } from '~/types'
type State = SubmissionState
& {
  isParsed: 'true' | 'false' | 'all'
}
export const useSubmissionStore = defineStore('submissionStore', {
  state(): State {
    return {
      docs: [],
      totalDocs: 2,
      limit: 2,
      totalPages: 2,
      page: 1,
      pagingCounter: 2,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: 2,

      isParsed: 'all'
    }
  },
  actions: {
    fetch(dto: GetArticleDto) {
      this.isParsed !== 'all' && (
        dto.filter = {
          ...dto.filter,
          isParsed: this.isParsed === 'true'
        }
      )

      return $fetch<ArticlePaginateResult>('/api/manage/submission', {
        method: 'post',
        body: dto
      }).then(result => {
        const { docs, ...data } = result
        this.$patch(data)
        return docs
      })
    }
  },
  getters: {
    getDocs(): Submission[] {
      return this.docs
    },
    getPage(): number {
      return this.page || 1
    },
    getTotalPages(): number {
      return this.totalPages
    },
    getTotalDocs(): number {
      return this.totalDocs
    },
  }
})
