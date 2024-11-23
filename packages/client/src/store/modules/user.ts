import { CreatorApi, creator } from '@/api'
import { LibraryEnum } from '@/enums'
import _ from 'lodash'
import { defineStore } from 'pinia'
import jsrsasign from 'jsrsasign'
import { Countor, SubmissionConfig, SubscriptionConfig, UserState } from './user-list'
import useStore from '..'

type State = UserState

export const useUserStore = defineStore('userStore', {
  state(): State {
    return {
      resourceDomain: '',
      hostname: '',
      account: '',
      isVip: false,
      vipExpirationAt: null,
      isTester: false,
      nickname: '',
      avatar: '',
      desc: '',
      email: '',
      homepage: '',
      phone: '',
      dir: {
        note: '',
        course: '',
        procedure: ''
      },
      countor: {
        date: '',
        noteCount: 0,
        procedureCount: 0,
        courseCount: 0,
        wordCount: 0,
        storageCount: 0
      },
      config: {
        autosave: true,
        saveInterval: 15000
      },
      submissionConfig: [],
      subscriptionConfig: [],
      shortcutConfig: []
    }
  },
  actions: {
    creatorApi() {
      return creator.getCreatorApi(this.account, this.hostname)!
    },
    updatePassword(params: Parameters<typeof CreatorApi.prototype.user.updatePassword>[0]) {
      return this.creatorApi().user.updatePassword(params)
    },
    update(params: Parameters<typeof CreatorApi.prototype.user.update>[0]) {
      const account = this.account
      const hostname = this.hostname
      return this.creatorApi()
        .user.update(params)
        .then(res => {
          // 更新当前用户 (需再一次比较当前用户，处理请求延迟中当前用户已发生变更的情况)
          if (account === this.account && hostname === this.hostname) {
            this.avatar = params.avatar
            this.nickname = params.nickname
            this.email = params.email
            this.phone = params.phone
            this.homepage = params.homepage
            this.desc = params.desc
            this.saveCache() // 更新缓存
          }
          const { userListStore } = useStore()
          userListStore.data.some((item, index, arr) => {
            if (item.account === account && item.hostname === hostname) {
              // 更新用户列表
              arr[index].avatar = params.avatar
              arr[index].nickname = params.nickname
              arr[index].email = params.email
              arr[index].phone = params.phone
              arr[index].desc = params.desc
              return true
            }
          })
        })
    },
    updateUserVipInfo(account: string, hostname: string) {
      const serverToken = sessionStorage.getItem(`Server:${account}&${hostname}`)
      if (!serverToken) return
      const payload = JSON.parse(jsrsasign.b64toutf8(serverToken.split('.')[1]))
      const { isVip, vipExpirationAt, isTester } = payload
      this.isVip = isVip
      this.vipExpirationAt = vipExpirationAt
      this.isTester = isTester
      if (account === this.account && hostname === this.hostname) {
        this.saveCache() // 更新缓存
      }
      const { userListStore } = useStore()
      userListStore.data.some((item, index, arr) => {
        if (item.account === account && item.hostname === hostname) {
          // 更新用户列表
          arr[index].isVip = isVip
          arr[index].vipExpirationAt = vipExpirationAt
          arr[index].isTester = isTester
          return true
        }
      })
    },
    updateConfig(params: Parameters<typeof CreatorApi.prototype.user.updateConfig>[0]) {
      return this.creatorApi()
        .user.updateConfig(params)
        .then(res => {
          this.config = params
          // console.log(this.$state)
          this.saveCache() // 更新缓存
        })
    },
    /** SubmissionConfig */
    addSubmissionConfig() {
      return this.creatorApi()
        .user.addSubmissionConfig<{ config: SubmissionConfig }>()
        .then(res => {
          // console.log(res.data)
          this.submissionConfig.push(res.data.config)
          this.saveCache()
          return res.data.config
        })
    },
    removeSubmissionConfig(id: string) {
      return this.creatorApi()
        .user.removeSubmissionConfig(id)
        .then(res => {
          this.submissionConfig.some((item, index, arr) => {
            if (item.id === id) {
              arr.splice(index, 1)
              this.saveCache()
              return true
            }
          })
        })
    },
    updateSubmissionConfig(dto: Parameters<typeof CreatorApi.prototype.user.updateSubmissionConfig>[0]) {
      return this.creatorApi()
        .user.updateSubmissionConfig(dto)
        .then(res => {
          this.submissionConfig.some((item, index, arr) => {
            if (item.id === dto.id) {
              arr[index] = dto
              this.saveCache()
              return true
            }
          })
        })
    },
    /** SubscriptionConfig */
    addSubscriptionConfig() {
      return this.creatorApi()
        .user.addSubscriptionConfig<{ config: SubscriptionConfig }>()
        .then(res => {
          // console.log(res.data)
          this.subscriptionConfig.push(res.data.config)
          this.saveCache()
          return res.data.config
        })
    },
    removeSubscriptionConfig(id: string) {
      return this.creatorApi()
        .user.removeSubscriptionConfig(id)
        .then(res => {
          this.subscriptionConfig.some((item, index, arr) => {
            if (item.id === id) {
              arr.splice(index, 1)
              this.saveCache()
              return true
            }
          })
        })
    },
    updateSubscriptionConfig(dto: Parameters<typeof CreatorApi.prototype.user.updateSubscriptionConfig>[0]) {
      return this.creatorApi()
        .user.updateSubscriptionConfig(dto)
        .then(res => {
          this.subscriptionConfig.some((item, index, arr) => {
            if (item.id === dto.id) {
              arr[index] = dto
              this.saveCache()
              return true
            }
          })
        })
    },
    getDirByLib(lib: LibraryEnum) {
      switch (lib) {
        case LibraryEnum.NOTE:
          return this.dir.note
        case LibraryEnum.COURSE:
          return this.dir.course
        case LibraryEnum.PROCEDURE:
          return this.dir.procedure
      }
    },
    /** 将当前用户信息保存至缓存 */
    saveCache() {
      if (this.account === '' || this.hostname === '') return
      const data = JSON.stringify(this.$state)
      localStorage.setItem(`User:${this.account}&${this.hostname}`, data)
    },

    addVip() {
      return this.creatorApi().user.addVip().then(() => {
        this.creatorApi().forceRefreshToken()
      })
    },
    async updateCountor() {
      try {
        const now = new Date()
        if (now.getTime() - new Date(this.countor.date).getTime() < 86400000) {
          return '今天已经统计过啦！'
        }
        const resp = await this.creatorApi().user.updateCountor<Countor>()
        this.countor = resp.data

        this.saveCache()

        const { userListStore } = useStore()
        userListStore.data.some((item, index, arr) => {
          if (item.account === this.account && item.hostname === this.hostname) {
            arr[index].countor = this.countor
            return true
          }
        })
      } catch (error) {
        console.log(error)
      }
      return ''
    }
  },
  getters: {}
})
