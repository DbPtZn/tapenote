import { defineStore } from 'pinia'
import type { Subfile, ColumnState } from '~/types'
import _ from 'lodash'
enum SortType {
  UPDATE = 'update',
  UPDATE_REVERSE = 'update_reverse',
  CREATE = 'create',
  CREATE_REVERSE = 'create_reverse',
  NAME = 'name',
  NAME_REVERSE = 'name_reverse'
}
export const useColumnStore = defineStore('columnStore',{
    state(): ColumnState {
      return {
        _id: '',
        name: '',
        isPublish: false,
        subfiles: []
      }
    },
    actions: {
      fetch(id: string) {
        $fetch<ColumnState>('/api/manage/column/list/' + id).then(res => {
          console.log(res)
          this._id = res._id
          this.name = res.name
          this.isPublish = res.isPublish
          this.subfiles = res.subfiles
        })
      },
      getSubfiles(sortType?: SortType) {
        switch (sortType) {
          case SortType.UPDATE:
            return this.getSubfilesSortUpdateAt
          case SortType.NAME:
            return this.getSubfilesSortByName
          case SortType.CREATE:
            return this.getSubfilesSortByCreateAt
          case SortType.UPDATE_REVERSE:
            return this.getSubfilesSortUpdateAtReverse
          case SortType.NAME_REVERSE:
            return this.getSubfilesSortByNameReverse
          case SortType.CREATE_REVERSE:
            return this.getSubfilesSortByCreateAtReverse
          default:
            return this.getSubfilesSortUpdateAt
        }
      },
    },
    getters: {
      getSubfilesSortByName(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => item.title) : []
      },
      getSubfilesSortUpdateAt(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.updateAt)) : []
      },
      getSubfilesSortByCreateAt(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.createAt)) : []
      },
      // reverse
      getSubfilesSortByNameReverse(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => item.title).reverse() : []
      },
      getSubfilesSortUpdateAtReverse(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.updateAt)).reverse() : []
      },
      getSubfilesSortByCreateAtReverse(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.createAt)).reverse() : []
      }
    },
})