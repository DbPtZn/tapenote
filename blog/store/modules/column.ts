import { defineStore } from 'pinia'
import type { ArticleType, ColumnState, Subfile } from '~/types'

export const useColumnStore = defineStore('columnStore',{
    state(): ColumnState {
      return {
        _id: '',
        userId: '',
        UID: '',
        account: '',
        name: '',
        isPublish: false,
        subfiles: [],
        createAt: '',
        updateAt: ''
      }
    },
    actions: {

    },
    getters: {},
})