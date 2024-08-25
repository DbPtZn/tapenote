/** creator */
import axios, { AxiosInstance, AxiosResponse } from 'axios'
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

function getSsoToken(account: string, hostname: string) {
  return sessionStorage.getItem(`SSO:${account}&${hostname}`)
}

function getAccessToken(account: string, hostname: string) {
  return sessionStorage.getItem(`User:${account}&${hostname}`)
}

let promise: Promise<any> | null // 确保当多次请求刷新 token 时，只发起一次请求
async function refreshToken(account: string, hostname: string) {
  // https://www.bilibili.com/video/BV1oK421e7cr 无感刷新详细讲解
  if (promise) return promise
  promise = new Promise(async resolve => {
    const resp = await axios.get('', {
      baseURL: import.meta.env.VITE_SSO_URL,
      headers: {
        Authorization: `Bearer ${getSsoToken(account, hostname)}`
      },
      __isRefreshToken: true
    } as any)
  
    // 看约定，比如刷新成功后返回一个 code 200
    resolve(resp.data.code === 200)
  })

  promise.finally(() => {
    promise = null
  })

  return promise
}

function isRefreshRequest(config: any) {
  return !!config.__isRefreshToken
}

const openSSO = import.meta.env.VITE_SSO_OPEN === 'true'

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
  constructor(account: string, hostname: string) {
    // 为该用户创建请求体实例
    const caxios = axios.create({
      baseURL: hostname,
      headers: {
        Authorization: `Bearer ${getAccessToken(account, hostname)}`
      }
    })
    caxios.interceptors.request.use(config => {
      if (!config?.headers) {
        throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
      }
      // 拦截请求，添加 token
      config.headers.Authorization = `Bearer ${getAccessToken(account, hostname)}`
      return config
    })
    caxios.interceptors.response.use(
      async (response: AxiosResponse) => {
        // 对响应数据做点什么

        // 启动 sso 单点登录模式的情况
        if(openSSO) {
          if(response.data.code === 401 && isRefreshRequest(response.config)) {
            
            // 刷新 token
            const isSuccess = await refreshToken(account, hostname)
            if (isSuccess) {
              // 重新请求
              response.config.headers.Authorization = `Bearer ${getSsoToken(account, hostname)}`
              const resp = await caxios.request(response.config)
              return resp
            } else {
              // 跳转到登录页面
              const { userListStore } = useStore()
              userListStore.logout(account, hostname)
              return response
            }
          }
        }

        return response
      },
      err => {
        if (err.response?.status) {
          const authorization = err.response.config.headers.Authorization as string
          switch (err.response?.status) {
            case 401:
              // Token 错误或者过期的情况
              if (authorization) {
                const { userListStore } = useStore()
                userListStore.logout(account, hostname)

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
    this.user = user(caxios)
    this.folder = folder(caxios)
    this.fragment = fragment(caxios)
    this.trash = trash(caxios)
    this.project = project(caxios)
    this.synthesizer = synthesizer(caxios)
    this.timbre = timbre(caxios)
    this.speaker = speaker(caxios)
    this.bgm = bgm(caxios)
    this.snapshot = snapshot(caxios)
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
  // console.log(2)
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

