import axios from "axios"

interface LoginDto {
  account: string
  password: string
  code: string
}

interface CreateUserDto {
  nickname?: string
  account: string
  password: string
  code: string
}

export const auth = {
  register<T>(data: CreateUserDto, hostname: string) {
    return axios({
      method: 'post',
      baseURL: hostname,
      url: '/auth/register',
      data: data
    })
  },
  // createRootDir(userId: string, hostname: string) {
  //   return axios({
  //     method: 'post',
  //     baseURL: hostname,
  //     url: '/auth/write/dir/' + userId,
  //   })
  // },
  /** 登录 */
  login<T>(data: LoginDto, hostname: string) {
    return axios({
      method: 'post',
      baseURL: hostname,
      url: '/auth/login',
      data: data
    })
  }
}
