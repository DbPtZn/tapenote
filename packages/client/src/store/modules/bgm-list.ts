import { creator, CreatorApi } from '@/api'
import { defineStore } from 'pinia'

interface BgmItem {
  id: string
  name: string
  audio: string
}

interface Bgm {
  key: string
  list: BgmItem[]
}

interface State {
  data: Bgm[]
}

export const useBgmStore = defineStore('bgmStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    creatorApi(account: string, hostname: string) {
      return creator.getCreatorApi(account, hostname)!
    },
    fetchAndSet(account: string, hostname: string) {
      return new Promise<Bgm>((resolve, reject) => {
        const index = this.data.findIndex(i => i.key === `${account}&${hostname}`)
        if (index !== -1) {
          resolve(this.data[index])
        } else {
          this.fetch<BgmItem[]>(account, hostname).then(res => {
            const bgm = this.set(res.data, account, hostname)
            // console.log(timbre)
            resolve(bgm)
          })
        }
      })
    },
    fetch<T>(account: string, hostname: string) {
      return this.creatorApi(account, hostname).bgm.getAll<T>()
    },
    set(data: BgmItem[], account: string, hostname: string) {
      const key = `${account}&${hostname}`
      const state = {
        key,
        list: data
      }
      this.data.push(state)
      return state
    },
    get(account: string, hostname: string) {
      return this.data.find(i => i.key === `${account}&${hostname}`)
    },
    add(params: Parameters<typeof CreatorApi.prototype.bgm.add>[0], account: string, hostname: string) {
      return this.creatorApi(account, hostname).bgm.add(params)
    },
    remove(id: string, account: string, hostname: string) {
      return this.creatorApi(account, hostname).bgm.remove(id)
    }

  },
  getters: {
    //
  }
})
