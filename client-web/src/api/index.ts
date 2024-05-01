//axios二次封装
import { RoutePathEnum } from '@/enums'
import router from '@/router'
import axios, { AxiosResponse } from 'axios'

// 添加请求拦截器
// 在发送请求之前做些什么
axios.interceptors.request.use(config => {
  if (!config?.headers) {
    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
  }
  return config
})
// 添加响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  err => {
    // 对响应错误做点什么
    if (err.response?.status) {
      if (err.response?.status === 401) {
        router.push(RoutePathEnum.LOGIN)
      }
      return Promise.reject(err)
    }
  }
)

export default axios
export * from './creator'
