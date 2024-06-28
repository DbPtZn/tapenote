import { Observable, Subject, Subscription, Injector, useContext, Injectable } from '@textbus/core'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
import axios, { AxiosInstance } from 'axios'
import { VNode, createApp } from 'vue'

@Injectable()
export class AxiosProvider {
  axios: AxiosInstance | null
  uploadImgUrl: string
  constructor() {
    this.axios = null
    this.uploadImgUrl = ''
  }
  set(args: {
    hostname: string,
    accessToken: string,
    uploadImgUrl: string
  }) {
    const { hostname, accessToken, uploadImgUrl } = args
    this.axios = axios.create({
      baseURL: hostname,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    this.uploadImgUrl = uploadImgUrl
  }

  uploadImg(img: string) {
    return new Promise<string>((resolve, reject) => {
      const formdata = new FormData()
      const file = base64ImgtoFile(img)
      formdata.append('file', file) //图片文件
      if(this.axios) {
        this.axios.post(this.uploadImgUrl, formdata).then(res => {
          // console.log(res)
          // console.log([res.data.host, res.data.url])
          const url = res.config.baseURL + res.data
          resolve(url)
        }).catch(err => reject(err))
      } else {
        reject('未设置请求体')
      }
    })
  }

  destory() {
    this.axios = null
  }
}

const base64ImgtoFile = (baseUrl: any, filename = 'file') => {
  const arr = baseUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const suffix = mime.split('/')[1]
  const bstr = window.atob(arr[1])
  // const bstr = Buffer.from(arr[1], 'base64').toString('base64')
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}
