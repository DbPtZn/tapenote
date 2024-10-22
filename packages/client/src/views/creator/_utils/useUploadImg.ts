import { getServerToken } from '@/api'
import axios from 'axios'
export function useUploadImg(uploadImgUrl: string, account: string, hostname: string) {
  const accessToken = getServerToken(account, hostname)
  const ResourceDomain = localStorage.getItem(`ResourceDomain:${hostname}`) as string
  const axiosInstance = axios.create({
    method: 'post',
    baseURL: hostname,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  function uploadImgFunction(img: string) {
    return new Promise<string>((resolve, reject) => {
      const formdata = new FormData()
      const file = base64ImgtoFile(img)
      formdata.append('file', file) //图片文件
      // formdata.append('dirname', this.dirname)
      axiosInstance
        .post(uploadImgUrl, formdata)
        .then(res => {
          // console.log('res.config.baseURL:', res.config.baseURL)
          // console.log('ResourceDomain:', ResourceDomain)
          const url = ResourceDomain + res.data
          resolve(url)
        })
        .catch(err => reject(err))
    })
  }
  
  function uploadImgFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const formdata = new FormData()
      formdata.append('file', file) //图片文件
      // formdata.append('dirname', this.dirname)
      axiosInstance
        .post(uploadImgUrl, formdata)
        .then(res => {
          resolve(ResourceDomain + res.data)
        })
        .catch(err => reject(err))
    })
  }
  
  return {
    uploadImgFunction,
    uploadImgFile
  }
}
function base64ImgtoFile(baseUrl: any) {
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
  return new File([u8arr], `image-${generateRandomString()}.${suffix}`, {
    type: mime
  })
}

function isBase64(str: string) {
  // const regex = /^data:image\/([a-zA-Z]+);base64,/
  const regex = /^data:image\/.*;base64,/i
  return regex.test(str)
}

function generateRandomString() {
  const timestamp = Date.now() // 获取当前时间戳
  const random = Math.floor(Math.random() * 1000000) // 生成一个随机数

  // 将时间戳和随机数转换为字符串，并使用 toLocaleLowerCase 确保字符串小写
  const randomString = `${timestamp}-${random.toString()}`

  // 返回生成的随机字符串
  return randomString
}
