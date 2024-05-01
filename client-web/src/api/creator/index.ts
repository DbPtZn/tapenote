/** creator */
import axios, { AxiosInstance, AxiosResponse } from 'axios'
// import { auth } from './auth'
export * from './auth'
import { user } from './user'
import { folder } from './folder'
import { trash } from './trash'
import { fragment } from './fragment'
import { project } from './project'
import { synthesizer } from './synthesizer'
import { timbre } from './timbre'
import { bgm } from './bgm'
import useStore from '@/store'

export class CreatorApi {
  user: ReturnType<typeof user>
  folder: ReturnType<typeof folder>
  project: ReturnType<typeof project>
  synthesizer: ReturnType<typeof synthesizer>
  fragment: ReturnType<typeof fragment>
  trash: ReturnType<typeof trash>
  timbre: ReturnType<typeof timbre>
  bgm: ReturnType<typeof bgm>
  constructor(account: string, hostname: string) {
    const accessToken = sessionStorage.getItem(`User:${account}&${hostname}`)
    // 为该用户创建请求体实例
    const caxios = axios.create({
      baseURL: hostname,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    caxios.interceptors.request.use(config => {
      if (!config?.headers) {
        throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
      }
      return config
    })
    caxios.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做点什么

        return response
      },
      err => {
        if (err.response?.status) {
          const authorization = err.response.config.headers.Authorization as string
          switch (err.response?.status) {
            case 401:
              if (authorization) {
                const token = authorization.substring(7)
                Object.keys(sessionStorage).map(key => {
                  if(sessionStorage.getItem(key) === token) {
                    const { userListStore } = useStore()
                    const arr = key.substring(5).split('&')
                    const account = arr[0]
                    const hostname = arr[1]
                    userListStore.logout(account, hostname)
                    console.warn(`${key} Token 错误或者过期，用户自动退出！`)
                  }
                })
              } else {
                const {  userListStore } = useStore()
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
    this.bgm = bgm(caxios)
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

