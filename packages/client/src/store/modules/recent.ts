import { LibraryEnum } from '@/enums'
import { defineStore } from 'pinia'
import { Subfile } from './folder'
import useStore from '..'
import { CreatorApi, creator } from '@/api'
import _ from 'lodash'

export interface State {
  currentLib: LibraryEnum
  data: Subfile[]
}

/** 三类项目数据全部缓存到data中，读取的时候通过 lib 筛选即可 */

export const useRecentStore = defineStore('recentStore', {
  state(): State {
    return {
      currentLib: LibraryEnum.NOTE,
      data: []
    }
  },
  actions: {
    creatorApi() {
      // 无法同时打开多个 creatorApi 的情况，可以直接从 userStore 读取 account 和 hostname
      const { userStore } = useStore()
      return creator.getCreatorApi(userStore.account, userStore.hostname)!
    },
    fetchAndSet(dto: Parameters<typeof CreatorApi.prototype.project.getRecent>[0]) {
      return this.creatorApi()
        .project.getRecent<Subfile[]>(dto)
        .then(res => {
          const data = res.data
          this.data.push(...data)
          return data.length === 0
        })
    },
    add(data: Subfile) {
      console.log('add recent')
      this.data.unshift(data)
      console.log(this.data)
    },
    // 数据更新
    updateCard(value: string, id: string, type: 'title' | 'content') {
      // 传入 folderId 参数时，会判断改动的项目是否位于当前开启的文件夹下，否时直接跳出
      this.data?.some((item, index, arr) => {
        if (item.id === id) {
          if (type === 'content') {
            arr[index].abbrev = value.replace(/<[^>]+>/g, '').slice(0, 100)
          }
          else if (type === 'title') {
            arr[index].title = value
          }
          arr[index].updateAt = new Date(Date.now()).toString()
          return true
        }
      })
    }
  },
  getters: {
    get: (state) => {
      return _.sortBy(state.data, (item) => new Date(item.updateAt)).reverse().filter(item => item.lib === state.currentLib)
    }
  }
})
