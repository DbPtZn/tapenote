/** creator */
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
// import { auth } from './auth'
export * from './auth'
import { user } from './user'
import { folder } from './folder'
import { trash } from './trash'
import { fragment } from './fragment'
import { project } from './project'
import { snapshot } from './snapshot'
import { synthesizer } from './synthesizer'
import { timbre } from './timbre'
import { bgm } from './bgm'
import useStore from '@/store'
import { speaker } from './speaker'



export class CreatorApi {
  user: ReturnType<typeof user>
  folder: ReturnType<typeof folder>
  project: ReturnType<typeof project>
  snapshot: ReturnType<typeof snapshot>
  synthesizer: ReturnType<typeof synthesizer>
  fragment: ReturnType<typeof fragment>
  trash: ReturnType<typeof trash>
  timbre: ReturnType<typeof timbre>
  speaker: ReturnType<typeof speaker>
  bgm: ReturnType<typeof bgm>


  private promise: Promise<any> | null = null // 确保当多次请求刷新 token 时，只发起一次请求
  private caxios: AxiosInstance
  constructor(account: string, hostname: string) {
    // 为该用户创建请求体实例
    this.caxios = axios.create({
      baseURL: hostname,
      headers: {
        Authorization: `Bearer ${this.getServerToken(account, hostname)}`
      }
    })
    this.caxios.interceptors.request.use(config => {
      if (!config?.headers) {
        throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
      }
      // 拦截请求，添加 token
      config.headers.Authorization = `Bearer ${this.getServerToken(account, hostname)}`

      // 针对 SSO 的请求，添加 sso-token
      // FIXME: 可能产生请求死循环
      // 重要：发送给 SSO 服务器的权限请求，如果 sso-token 错误，会导致死循环
      // 向 sso 服务器发送请求时携带 serverToken 导致错误 - 触发刷新token - 刷新又添加 serverToken重新向 sso 服务器发送请求
      // 目前暂时没有办法区分来自 server 和 sso 的 401 错误
      if(['/user/pwd'].includes(config.url!)) {
        const ssoToken = this.getSsoToken(account, hostname)
        if(ssoToken) config.headers.Authorization = `Bearer ${ssoToken}`
      }
      defense = 0
      return config
    })
    let defense = 0 // 防御措施，防止无限重试
    this.caxios.interceptors.response.use(
      async (response: AxiosResponse) => {
        // 对响应数据做点什么
        return response
      },
      async (err: AxiosError<any>) => {
        if (err.code === 'ERR_NETWORK') return alert('无法连接到服务器')
        if (err.response?.status) {
          switch (err.response?.status) {
            case 401:
              /** ------------ ↓ 防御性策略 ↓ ------------ */
              // 短时间达到 10 次 401 错误，则抛出错误不要继续请求
              if(defense > 10) {
                defense = 0
                return Promise.reject(err)
              }
              defense ++
              /** ------------ ↑ 防御性策略 ↑ ------------ */
              // console.log('ssoToke:', this.getSsoToken(account, hostname))
              const resp = await this.refreshTokenAndRequestAgain(err.response, account, hostname)
              if(resp) return resp  // 返回重新请求的结果

              // Token 错误或者过期的情况
              const authorization = err.response.config.headers.Authorization as string
              if (authorization) {
                const { userListStore } = useStore()
                userListStore.logout(account, hostname)
              } else {
                const { userListStore } = useStore()
                userListStore.checkCaches()
                console.warn(`缺少 Token 验证信息，用户自动退出！`)
              }
              break
            case 403:
              console.log('服务器禁止请求')
          }
        }
        console.log(err)
        return Promise.reject(err)
      }
    )
    // 配置请求
    this.user = user(this.caxios)
    this.folder = folder(this.caxios)
    this.fragment = fragment(this.caxios)
    this.trash = trash(this.caxios)
    this.project = project(this.caxios)
    this.synthesizer = synthesizer(this.caxios)
    this.timbre = timbre(this.caxios)
    this.speaker = speaker(this.caxios)
    this.bgm = bgm(this.caxios)
    this.snapshot = snapshot(this.caxios)
  }

  /** sso 模式下：请求 server 失败返回 401 （server-token 无效）时调用，通过 sso-token 重新更新 server-token */
  async refreshTokenAndRequestAgain(response: AxiosResponse,account: string, hostname: string) {
    // console.log('ssoToke:', this.getSsoToken(account, hostname))
    // 判断 sso-token 是否存在
    if(this.getSsoToken(account, hostname)) {
      // 判断是否属于 sso-token 的响应，否则可能陷入无限循环
      if(!this.isRefreshRequest(response.config)) {
        // 刷新 token
        const isSuccess = await this.refreshToken(account, hostname)
        // 刷新 server-token 成功后重新发送此前的请求
        if (isSuccess) {
          // 更新 server-token 并重新发送请求
          response.config.headers.Authorization = `Bearer ${this.getServerToken(account, hostname)}`
          const resp = await this.caxios.request(response.config)
          return resp
        } else {
          // 跳转到登录页面
          console.log('sso-token 失效，登出用户')
          const { userListStore } = useStore()
          userListStore.logout(account, hostname)
          return response
        }
      }
    }
    return undefined
  }

  getSsoToken(account: string, hostname: string) {
    return sessionStorage.getItem(`SSO:${account}&${hostname}`)
  }
  
  getServerToken(account: string, hostname: string) {
    return sessionStorage.getItem(`Server:${account}&${hostname}`)
  }
  
  async refreshToken(account: string, hostname: string) {
    // https://www.bilibili.com/video/BV1oK421e7cr 无感刷新详细讲解
    // console.log('refreshToken:', this.getSsoToken(account, hostname))
    if (this.promise) return this.promise
    this.promise = new Promise(async resolve => {
      await axios.get('/auth/identify', {
        baseURL: hostname,
        headers: {
          Authorization: `Bearer ${this.getSsoToken(account, hostname)}`,
        },
        __isRefreshToken: true
      } as any).then(resp => {
        console.log('resp:', resp)
        if(resp?.data?.token) {
          // 刷新成功，重新设置 server-token
          console.log('刷新成功，重新设置 server-token')
          sessionStorage.setItem(`Server:${account}&${hostname}`, resp.data.token)
        }
        // 约定: 比如刷新成功后返回一个值来判断是否刷新成功
        resolve(resp?.data?.type === 'server')
      }).catch(err => {
        resolve(false)
      })
    })
  
    this.promise.finally(() => {
      this.promise = null
    })
  
    return this.promise
  }
  
  isRefreshRequest(config: any) {
    // console.log('config:', config)
    // console.log('isRefreshToken:', config.__isRefreshToken)
    return !!config.__isRefreshToken
  }
}

const creatorApiMap = new Map<string, CreatorApi>()
// 为用户创建一个请求实例并保存起来
function createCreatorApi(account: string, hostname: string) {
  // console.log(1)
  const key = account + '&' + hostname
  if (creatorApiMap.has(key)) return
  const creatorApi = new CreatorApi(account, hostname)
  creatorApiMap.set(key, creatorApi)
}

function removeCreatorApi(account: string, hostname: string) {
  const key = account + '&' + hostname
  creatorApiMap.delete(key)
}

// 根据用户账号和host名获取请求实例
function getCreatorApi(account: string, hostname: string) {
  const key = account + '&' + hostname
  // console.log(key)
  const creatorApi = creatorApiMap.get(key)
  return creatorApi
}

export const creator = {
  createCreatorApi,
  getCreatorApi,
  removeCreatorApi
}

// const token = authorization.substring(7)
// Object.keys(sessionStorage).map(key => {
//   if(sessionStorage.getItem(key) === token) {
//     const { userListStore } = useStore()
//     const arr = key.substring(5).split('&')
//     const account = arr[0]
//     const hostname = arr[1]
//     userListStore.logout(account, hostname)
//     console.warn(`${key} Token 错误或者过期，用户自动退出！`)
//   }
// })