import { Observable, Subject, Injectable } from '@textbus/core'
import axios, { AxiosInstance } from 'axios'
import utils from '@/utils'
@Injectable()
export class ImgToUrlService {
  private axios: AxiosInstance | null
  private uploadImgUrl: string

  private finishEvent: Subject<any> = new Subject()
  onFinish: Observable<any> = this.finishEvent.asObservable()
  private errorEvent: Subject<any> = new Subject()
  onError: Observable<any> = this.errorEvent.asObservable()
  promiseSequence: Promise<any>[]

  tasks: number // 任务数
  constructor() {
    this.axios = null
    this.uploadImgUrl = ''
    this.tasks = 0
    this.promiseSequence = []
  }

  setup(args: {
    hostname: string,
    accessToken: string,
    uploadImgUrl: string
  }) {
    const { hostname, accessToken, uploadImgUrl } = args
    this.axios = axios.create({
      method: 'post',
      baseURL: hostname,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    this.uploadImgUrl = uploadImgUrl
  }

  /** 添加任务 */
  addTask() {
    this.tasks++
  }

  /** 移出任务 */
  removeTask() {
    this.tasks--
  }

  /** 任务完成 */
  finish() {
    this.finishEvent.next('')
  }

  /** 任务出错 */
  error(msg: string) {
    const err = new Error(msg)
    this.errorEvent.next(err)
  }

  /** 检查进度： 如果任务数为0，任务完成 */
  checkProcess() {
    if (this.tasks === 0) this.finish()
  }

  /** 独立上传图片 */
  uploadImg(img: string) {
    return new Promise<string>((resolve, reject) => {
      const formdata = new FormData()
      const file = this.base64ImgtoFile(img)
      formdata.append('file', file) //图片文件
      // console.log(this.axios)
      if(this.axios) {
        this.axios.post(this.uploadImgUrl, formdata).then(res => {
          const url = res.config.baseURL + res.data
          resolve(url)
        }).catch(err => reject(err))
      } else {
        // 初始化编辑器时， setup 在组件加载之后，所以设置一定延迟来等待 axios 初始化完成
        const timer = setTimeout(() => {
          this.axios?.post(this.uploadImgUrl, formdata).then(res => {
            const url = res.config.baseURL + res.data
            resolve(url)
          }).catch(err => reject(err))
          clearTimeout(timer)
        }, 100)
      }
    })
  }


  /** 加入图片转化的进程(多张图片的情况) */
  addProcess(src: string, callback: (url: string) => void) {
    this.addTask()
    // const regex = /^data:image\/([a-zA-Z]+);base64,/
    this.promiseSequence.push(
      this.imgBase64ToUrl(src)
        .then(url => {
          callback(url)
          this.removeTask()
        })
        .catch(err => {
          this.error(err)
        })
    )
    // if (regex.test(src)) {
    //   this.promiseSequence.push(
    //     this.imgBase64ToUrl(src)
    //       .then(base64 => {
    //         callback(base64)
    //         this.removeTask()
    //       })
    //       .catch(err => {
    //         this.error(err)
    //       })
    //   )
    // } else {
    //   this.promiseSequence.push(
    //     this.urlToLocal(src)
    //       .then(url => {
    //         callback(url)
    //         this.removeTask()
    //       })
    //       .catch(err => {
    //         this.error(err)
    //       })
    //   )
    // }
  }

  /** 将远程地址转化为本地地址 */
  // urlToLocal(url: string) {
  //   return new Promise<string>((resolve, reject) => {
  //     // 创建图片地址
  //     let extname = url.split('.').pop()
  //     if (!extname || !['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extname)) extname = 'png'
  //     fetch(url).then(res => {
  //       res.blob().then(blob => {
  //       })
  //     })
  //   })
  // }
  isBase64(str: string) {
    const regex = /^data:image\/([a-zA-Z]+);base64,/
    return regex.test(str)
  }

  /**
   * 图片base64转url链接
   * @param {String} base64 图片base64
   * @returns 转url后的值或者报错信息
   */
  private imgBase64ToUrl = (base64Data: string) => {
    return new Promise<string>((resolve, reject) => {
      if (!base64Data) {
        reject('请传入base64内容')
      }
      // 图片已经是 url 格式的情况，直接返回图片数据
      // const regex = /^data:image\/([a-zA-Z]+);base64,/
      // if (!regex.test(base64Data)) reject('非base64图片数据')
      // 使用正则表达式提取 base64 数据中的图片编码部分（不包含前缀）
      // const base64Image = base64Data.split(';base64,').pop()
      let extname = base64Data.split(';')[0].split(':')[1].split('/')[1]
      if (!['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extname)) extname = 'png'
      // 上传图片
      const formdata = new FormData()
      const file = this.base64ImgtoFile(base64Data)
      formdata.append('file', file, `${Date.now().toString()}.${extname}`)

      if (this.axios) {
        this.axios.post(this.uploadImgUrl, formdata).then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
      } else {
        reject('未设置上传地址！')
      }
    })
  }

  private base64ImgtoFile = (baseUrl: any) => {
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
    return new File([u8arr], `image.${suffix}`, {
      type: mime
    })
  }
}
