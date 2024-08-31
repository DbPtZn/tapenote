import { auth, creator } from '@/api'
import { Subject } from '@tanbo/stream'
import _ from 'lodash'
import { defineStore } from 'pinia'
import jsrsasign from 'jsrsasign'
import useStore from '..'
import axios from 'axios'
export interface SubmissionConfig {
  id: string
  name: string
  site: string
  code: string
  desc: string
}
export interface SubscriptionConfig {
  id: string
  name: string
  site: string
  code: string
  desc: string
}
export interface User {
  resourceDomain: string
  account: string
  nickname: string
  avatar: string
  desc: string
  email: string
  homepage: string
  phone: string
  dir: {
    note: string
    course: string
    procedure: string
  },
  config: {
    autosave: boolean, // 是否自动保存
    saveInterval: number // 自动保存间隔毫秒
  }
  submissionConfig: SubmissionConfig[],
  subscriptionConfig: SubscriptionConfig[]
}

export interface UserState extends User {
  hostname: string
}

type State = {
  data: UserState[]
  sequence: string[]
}

const loginStateChangeEvent = new Subject<{ type: 'login' | 'logout'; account: string; hostname: string }>()
const onLoginStateChange = loginStateChangeEvent.asObservable()

export const useUserListStore = defineStore('userListStore', {
  state(): State {
    return {
      data: [],
      sequence: []
    }
  },
  actions: {
    creatorApi(account: string, hostname: string) {
      return creator.getCreatorApi(account, hostname)!
    },
    /** 注册 */
    register(params: Parameters<typeof auth.register>[0], hostname: string) {
      return auth.register(params, hostname)
      // .then(res => {
      //   // const id = res.data.id
      //   // auth.createRootDir(id, hostname)
      // })
    },
    /** 登录业务系统 */
    login(params: Parameters<typeof auth.login>[0], hostname: string) {
      const { userStore, folderStore, folderTreeStore } = useStore()
      return new Promise<string | undefined>((resolve, reject) => {
        auth
          .login(params, hostname)
          .then(res => {
            // console.log(res)
            if (!res.data) reject('登录失败')

            // 存储 sso-token 或 server-token （ 若存储了 sso-token, 则会在下一次请求 server 时触发 refreshToken，自动获取 server-token ）
            sessionStorage.setItem(res.data.type === 'sso' ? `SSO:${params.account}&${hostname}` : `User:${params.account}&${hostname}`, res.data.token as string)

            // 创建用户请求实例
            creator.createCreatorApi(params.account, hostname)
            this.fetch(params.account, hostname).then(state => {
              const data = this.set(state) // 拿到头像等路径处理后的数据
              this.addSequence(params.account, hostname)
              userStore.$patch(data)
              folderTreeStore.$reset() // 新登录用户时重置文件夹目录
              folderStore.$reset() // 新登录用户时重置文件夹
              loginStateChangeEvent.next({ type: 'login', account: params.account, hostname })
              resolve(data?.avatar)
            }).catch(err => reject(err))
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    logout(account: string, hostname: string) {
      const { folderTreeStore, folderStore, userStore, projectStore } = useStore()
      // 用户列表中移除登出用户
      const index = this.data.findIndex(item => item.account === account && item.hostname === hostname)
      this.data.splice(index, 1)
      // 登出时清理缓存
      const ssoKey = `SSO:${account}&${hostname}`
      const userkey = `User:${account}&${hostname}`
      const folderTreeKey = `FolderTree:${account}&${hostname}`
      const folderKey = `Folder:${account}&${hostname}`
      localStorage.removeItem(userkey) // 这个存的是用户信息
      sessionStorage.removeItem(ssoKey)
      sessionStorage.removeItem(userkey) // 这个存的是用户 token
      localStorage.removeItem(folderTreeKey)
      localStorage.removeItem(folderKey)
      projectStore.cleanCacheByUser(account, hostname)
      // 登出用户与当前用户相同，退出后重置用户状态、文件目录状态、文件夹状态
      if (account === userStore.account && hostname === userStore.hostname) {
        userStore.$reset()
        folderTreeStore.$reset()
        folderStore.$reset()
      }
      // 3.如果当前用户不存在了，从缓存中查询其它已登录的用户并设置为当前用户
      this.autoFilling()
      this.removeSequence(account, hostname)
      // 4.移除用户的请求体信息
      creator.removeCreatorApi(account, hostname)
      loginStateChangeEvent.next({ type: 'logout', account, hostname })
    },
    onloginStateChange() {
      return onLoginStateChange
    },
    fetchAndSet(account: string, hostname: string) {
      return new Promise<UserState>((resolve, reject) => {
        // 第一优先：从 store 中获取信息
        const state = this.get(account, hostname)
        if (state) {
          resolve(state)
          return
        }
        const key = `User:${account}&${hostname}`
        const token = sessionStorage.getItem(key)
        const userStateStr = localStorage.getItem(key)
        // 第二优先：使用缓存中的用户信息
        if (token) {
          if (userStateStr) {
            const state = JSON.parse(userStateStr) as UserState
            this.data.push(state)
            resolve(state)
          } else {
            // 第三优先：从服务器获取用户信息
            this.fetch(account, hostname).then(state => {
              if (state) {
                this.set(state)
                resolve(state)
              } else {
                reject('未找到用户信息或 token 失效')
              }
            })
          }
        } else {
          // 如果 token 不存在，但用户缓存存在，则清除用户缓存
          if (userStateStr) {
            localStorage.removeItem(key)
          }
          reject('token 已失效')
        }
      })
    },
    /** 请求用户信息（token 存在的情况下才会生效） */
    fetch(account: string, hostname: string): Promise<UserState> {
      return this.creatorApi(account, hostname).user
        .get<User>()
        .then(res => {
          console.log('请求用户数据成功')
          return {
            hostname: hostname,
            ...res.data
          }
        })
        .catch(err => {
          if (err.status === 401) {
            sessionStorage.removeItem(`User:${account}&${hostname}`)
            loginStateChangeEvent.next({ type: 'logout', account, hostname })
            console.warn('token 无效')
          }
          throw err
        })
    },
    set(data: UserState) {
      const resourceDomain = data.resourceDomain ? data.resourceDomain : data.hostname
      // console.log('resourceDomain:', resourceDomain)
      const state: UserState = {
        resourceDomain: resourceDomain,
        hostname: data.hostname,
        account: data.account,
        nickname: data.nickname,
        avatar: data.avatar ? resourceDomain + data.avatar : '',
        desc: data.desc || '',
        email: data.email || '',
        homepage: data.homepage || '',
        phone: data.phone || '',
        dir: {
          note: data?.dir?.note || '',
          course: data?.dir?.course || '',
          procedure: data?.dir?.procedure || ''
        },
        config: data.config || { autosave: true , saveInterval: 15000 },
        submissionConfig: data.submissionConfig || [],
        subscriptionConfig: data.subscriptionConfig || []
      }

      // 添加默认投稿配置（硬编码，所有通过该客户端登录的用户都会有这一条配置）
      const defaultSubmissionConfig = {
        id: 'Tapenote@Offical',
        name: import.meta.env.VITE_OFFICAL_SUBMIT_NAME,
        site: import.meta.env.VITE_OFFICAL_SUBMIT_SITE,
        code: import.meta.env.VITE_OFFICAL_SUBMIT_CODE,
        desc: import.meta.env.VITE_OFFICAL_SUBMIT_DESC
      }
      if(!state.submissionConfig) {
        state.submissionConfig = [defaultSubmissionConfig]
      } else if(state.submissionConfig[0]?.id !== defaultSubmissionConfig.id) {
        state.submissionConfig.unshift(defaultSubmissionConfig)
      }

      // 特殊情况处理：
      // 1. 如果 hostname 为空
      if (!state.hostname) throw console.warn('未设置主机名')
      // 2. 如果 account 为空
      if (!state.account) throw console.warn('未设置账户')
      // 3. 如果用户信息已存在，则直接更新用户信息
      const index = this.data.findIndex(item => item.account === state.account && item.hostname === state.hostname)
      if (index !== -1) {
        this.data[index] = state
        this.setCache(state)
        return state
      }
      this.data.push(state)
      this.setCache(state)
      return state
    },
    get(account: string, hostname: string) {
      const index = this.data.findIndex(item => item.account === account && item.hostname === hostname)
      if (index !== -1) return this.data[index]
    },
    async checkToken(account: string, hostname: string) {
      // console.log('检查 token 是否即将过期')
      const ssokey = `SSO:${account}&${hostname}`
      const serverkey = `User:${account}&${hostname}`
      const ssoToken = sessionStorage.getItem(ssokey)
      // 存在 sso-token 时不需要主动更新 server-token
      if(ssoToken) {
        const payload = JSON.parse(jsrsasign.b64toutf8(ssoToken.split('.')[1]))
        const { exp, rfh } = payload // exp 是以秒为单位的时间戳
        // console.log('rfh:', rfh, 'exp:', exp)
        // 不能使用客户端时间，因为客户端时间可能不准确，必须使用服务器时间
        const nowTimestamp = await axios.get(`${hostname}/date`).then(res => Number(res.data)/1000)
        // console.log('nowTimestamp:', nowTimestamp)
        if(nowTimestamp > exp) return this.logout(account, hostname)  // 已经到期，退出登录
        // 检查剩余时间是否小于或等于一天
        // console.log('剩余刷新时间:', `${(rfh - nowTimestamp) / 3600} hours`)
        // console.log('sso token 是否即将过期:', nowTimestamp >= rfh)
        if(nowTimestamp >= rfh) {
          // sso-token 即将过期，申请更新 sso-token
          await axios.get('/auth/refresh', {
            baseURL: hostname,
            headers: {
              Authorization: `Bearer ${ssoToken}`
            }
          }).then(resp => {
            if(resp?.data?.type === 'sso') {
              sessionStorage.setItem(ssokey, resp?.data?.token as string)
              console.log('更新 sso-token 成功')
            }
          }).catch(err => {
            console.error('更新 sso-token 失败！')
          })
        }
        return  // 若存在 sso-token 就不需要主动更新 server-token 了
      }
      const serverToken = sessionStorage.getItem(serverkey)
      if(serverToken) {
        const payload = JSON.parse(jsrsasign.b64toutf8(serverToken.split('.')[1]))
        const { exp, rfh } = payload // exp 是以秒为单位的时间戳
        const nowTimestamp = await axios.get(`${hostname}/date`).then(res => Number(res.data)/1000)
        if(nowTimestamp > exp) return this.logout(account, hostname)  // 已经到期，退出登录
        if(nowTimestamp >= rfh) {
          // server-token 即将过期，申请更新 server-token
          await axios.get('/auth/refresh', {
            baseURL: hostname,
            headers: {
              Authorization: `Bearer ${serverToken}`
            }
          }).then(resp => {
            if(resp?.data?.type === 'server') {
              sessionStorage.setItem(serverkey, resp?.data?.token as string)
              console.log('更新 server-token 成功')
            }
          }).catch(err => {
            console.error('更新 server-token 失败！')
          })
        }
      }
    },
    fillInfo() {
      /** 补全排序信息 */
      const sequence = sessionStorage.getItem('sequence')
      this.sequence = sequence ? JSON.parse(sequence) : []
      if (this.sequence.length === 0) {
        Object.keys(sessionStorage).map(key => {
          const prefix = key.substring(0, 5)
          if (prefix === 'User:') {
            const arr = key.substring(5).split('&')
            const account = arr[0]
            const hostname = arr[1]
            // 补全排序信息
            this.addSequence(account, hostname)
          }
        })
      }
      /** 补全用户信息 */
      const userSessionKeys: string[] = []
      Object.keys(sessionStorage).map(key => {
        const prefix = key.substring(0, 5)
        if (prefix === 'User:') {
          // 创建用户请求实例
          const arr = key.substring(5).split('&')
          const account = arr[0]
          const hostname = arr[1]
          this.checkToken(account, hostname)
          creator.createCreatorApi(account, hostname)
          // 记录用户缓存的 session key
          userSessionKeys.push(key)
        }
      })
      const promiseArr: Promise<any>[] = []
      for (let i = 0; i < userSessionKeys.length; i++) {
        const userStateStr = localStorage.getItem(userSessionKeys[i])
        if (!userStateStr) {
          const suffix = userSessionKeys[i].substring(5)
          const arr = suffix.split('&')
          const account = arr[0]
          const hostname = arr[1]
          promiseArr.push(
            this.fetch(account, hostname).then(state => {
              state && this.set(state)
            })
          )
        }
      }
      return Promise.all(promiseArr)
    },
    autoFilling() {
      if (this.data.length === 0) return
      const { folderTreeStore, folderStore, userStore } = useStore()
      if (!userStore.account || !userStore.hostname) {
        const data = this.data[this.data.findIndex(item => `User:${item.account}&${item.hostname}` === this.sequence[0])]
        // 自动补位时按排序第一的补位，如果不存在，则按缓存的第一补位
        data ? userStore.$patch(data) : userStore.$patch(this.data[0])
        // 获取缓存的当前用户的目录树状态并设置
        folderTreeStore.getCache(userStore.account, userStore.hostname)
        folderStore.getCache(userStore.account, userStore.hostname)
      }
    },
    getResourceDomain(account: string, hostname: string) {
      return this.get(account, hostname)?.resourceDomain
    },
    checkCaches() {
      Object.keys(localStorage).map(key => {
        const prefix = key.substring(0, 5)
        if (prefix === 'User:') {
          const token = sessionStorage.getItem(key)
          if (!token) {
            const arr = key.substring(5).split('&')
            const account = arr[0]
            const hostname = arr[1]
            this.logout(account, hostname)
          }
        }
      })
    },
    // getCache() {},
    /** 设置缓存 */
    setCache(data: UserState) {
      if (data.account === '' || data.hostname === '') return
      localStorage.setItem(`User:${data.account}&${data.hostname}`, JSON.stringify(data))
      localStorage.setItem(`ResourceDomain:${data.hostname}`, data.resourceDomain) // 缓存资源域名(会被覆盖，不会移除)
      // const ResourceDomain = localStorage.getItem(`ResourceDomain:${props.hostname}`) as string
    },
     /** 移除缓存 */
    removeCache(account: string, hostname: string) {
      const key = `User:${account}&${hostname}`
      localStorage.removeItem(key)
    },
    queryCache(account: string, hostname: string) {
      const key = `User:${account}&${hostname}`
      const token = sessionStorage.getItem(key)
      const user = localStorage.getItem(key)
      if (token && user) return { token, user }
      return null
    },
    addSequence(account: string, hostname: string) {
      const key = `User:${account}&${hostname}`
      if (this.sequence.includes(key)) return
      this.sequence.push(key)
      sessionStorage.setItem('sequence', JSON.stringify(this.sequence))
    },
    removeSequence(account: string, hostname: string) {
      const key = `User:${account}&${hostname}`
      this.sequence.splice(this.sequence.indexOf(key), 1)
      sessionStorage.setItem('sequence', JSON.stringify(this.sequence))
    },
    moveSequence(args: { moved: { element: any, oldIndex: number, newIndex: number } }) {
      const { element, oldIndex, newIndex } = args.moved
      const str = sessionStorage.getItem('sequence')
      if (!str) return
      const newSequence = JSON.parse(str)
      newSequence.splice(oldIndex, 1)
      const key = `User:${element.account}&${element.hostname}`
      newSequence.splice(newIndex, 0, key)
      sessionStorage.setItem('sequence', JSON.stringify(newSequence))
    },
    checkSequence() {
      this.sequence.forEach((key, index, arr) => {
        const item = sessionStorage.getItem(key)
        if (!item) {
          arr.splice(index, 1)
          sessionStorage.setItem('sequence', JSON.stringify(arr))
        }
      })
    }
  },
  getters: {
    getData(state) {
      return state.data.map((item) => {
        return {
          key: `User:${item.account}&${item.hostname}`,
          ...item
          // hostname: item.hostname || '',
          // account: item.account || '',
          // nickname: item.nickname || '',
          // avatar: item.avatar || '',
          // desc: item.desc || '',
          // email: item.email || '',
          // phone: item.phone || '',
          // homepage: item.homepage || '',
          // dir: {
          //   note: item.dir.note || '',
          //   course: item.dir.course || '',
          //   procedure: item.dir.procedure || ''
          // },
          // config: item.config || [],
          // submissionConfig: item.submissionConfig || [],
          // subscriptionConfig: item.subscriptionConfig || []
        }
      }).sort((a, b) => {
        return state.sequence.indexOf(a.key) - state.sequence.indexOf(b.key)
      })
    }
  }
})