// import axios from '../index'
// import axios from "axios"

import { AxiosInstance } from "axios"
import { update } from "lodash"

interface UpdateUserDto {
  nickname: string
  avatar: string
  email: string
  phone: string
  homepage: string
  desc: string
}

interface UpdateUserPwdDto {
  oldPwd: string
  newPwd: string
  code?: string
}


interface UpdateUserConfigDto {
  autosave: boolean
  saveInterval: number
  autoLoadCourse: boolean
}


interface UpdateUserSubmissionConfigDto {
  id: string
  name: string
  site: string
  code: string
  desc: string
}

interface UpdateUserSubscriptionConfigDto {
  id: string
  name: string
  site: string
  code: string
  desc: string
}

export const user = (axios: AxiosInstance) => {
  return {
    get<T>() {
      return axios.get<T>('/user/read/info/')
    },
    // getDir<T>() {
    //   return axios.get<T>('/user/read/dir/')
    // },
    update<T>(dto: UpdateUserDto) {
      return axios.patch<T>('/user/update/info', dto)
    },
    updatePassword<T>(dto: UpdateUserPwdDto) {
      return axios.patch<T>('/user/pwd', dto)
    },
    updateConfig<T>(dto: UpdateUserConfigDto) {
      return axios.patch<T>('/user/update/config', dto)
    },
    addSubmissionConfig<T>() {
      return axios.patch<T>('/user/update/submission/add')
    },
    removeSubmissionConfig<T>(id: string) {
      return axios.patch<T>('/user/update/submission/remove/' + id)
    },
    updateSubmissionConfig<T>(dto: UpdateUserSubmissionConfigDto) {
      return axios.patch<T>('/user/update/submission/modify', dto)
    },

    addSubscriptionConfig<T>() {
      return axios.patch<T>('/user/update/subscription/add')
    },
    removeSubscriptionConfig<T>(id: string) {
      return axios.patch<T>('/user/update/subscription/remove/' + id)
    },
    updateSubscriptionConfig<T>(dto: UpdateUserSubscriptionConfigDto) {
      return axios.patch<T>('/user/update/subscription/modify', dto)
    },
    updateCountor<T>() {
      return axios.patch<T>('/user/update/countor')
    },
    addVip<T>() {
      return axios.post<T>('/user/addVip')
    }
  }
}
