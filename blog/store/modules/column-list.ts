import { defineStore } from 'pinia'
import type { CreateColumnDto } from '~/dto'
import type { ArticleType, ColumnState, ColumnType, Subfile } from '~/types'

type State = {
  data: ColumnType[]
}

export const useColumnListStore = defineStore('columnListStore',{
    state(): State {
      return {
        data: []
      }
    },
    actions: {
      create(dto: CreateColumnDto) {
        $fetch<ColumnType>('/api/manage/column/create', {
          method: 'POST',
          body: dto
        }).then(data => {
          console.log(data)
          this.data.unshift(data)
        })
      },
      get() {
        $fetch<ColumnType[]>('/api/manage/column/all').then(data => {
          console.log(data)
          this.data = data
        })
      }
    },
    getters: {},
})