import { defineStore } from 'pinia'
import type { UpdateColumnSequenceDto } from '~/dto'
import type { ArticleType, UserState, Subfile } from '~/types'

export const useUserStore = defineStore('userStore', {
  state(): UserState {
    return {
      _id: '',
      UID: '',
      account: '',
      nickname: '',
      avatar: '',
      desc: '',
      info: {
        email: '',
        phone: ''
      },
      receiverConfig: {
        status: 0,
        autoParse: false,
        sizeLimit: 0
      },
      columnSequence: [],
      createAt: '',
      updateAt: ''
    }
  },
  actions: {
    fetch() {
      return $fetch<UserState>('/api/user/info').then(data => {
        // console.log(data)
        this.set(data)
      })
    },
    set(data: UserState) {
      this.$patch(data)
    },
    updateColumnSequence(oldIndex: number, newIndex: number, columnId: string) {
      this.columnSequence.splice(oldIndex, 1)
      this.columnSequence.splice(newIndex, 0, columnId)
      return $fetch('/api/user/updateColumnSequence', {
        method: 'POST',
        body: { sequence: this.columnSequence }
      })
    }
  },
  getters: {}
})
