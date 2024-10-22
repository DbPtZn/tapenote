import { Injectable } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'
import { AxiosInstance } from 'axios'

@Injectable()
export class Img2base64Service {
  // private axios: AxiosInstance | null
  // private uploadImgUrl: string

  private finishEvent: Subject<any> = new Subject()
  onFinish: Observable<any> = this.finishEvent.asObservable()
  private errorEvent: Subject<any> = new Subject()
  onError: Observable<any> = this.errorEvent.asObservable()
  promiseSequence: Promise<any>[]

  tasks: number // 任务数
  constructor() {
    // this.axios = null
    // this.uploadImgUrl = ''
    this.tasks = 0
    this.promiseSequence = []
  }

  /** 添加任务 */
  addTask() {
    this.tasks++
  }

  /** 移出任务 */
  removeTask() {
    this.tasks--
    // if (this.tasks === 0) {
    //   this.finish()
    // }
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
    if(this.tasks === 0) this.finish()
  }

  /** 加入图片转化的进程 */
  addProcess(url: string, callback: (base64: string) => void) {
    this.addTask()
    this.promiseSequence.push(
      Img2base64Service.imgUrlToBase64(url).then((base64) => {
        callback(base64)
        this.removeTask()
      }).catch((err) => {
        this.error(err)
      })
    )
  }

  /**
   * 图片url链接转base64
   * @param {String} url 图片链接
   * @returns 转base64后的值或者报错信息
   */
  static imgUrlToBase64 = (url: string) => {
    return new Promise<string>((resolve, reject) => {
      if (!url) {
        reject('请传入url内容')
      }
      // 图片已经是 base64 格式的情况，直接返回图片数据
      const base64Regex = /^data:image\/([a-z]+);base64,/
      if(base64Regex.test(url)) {
        resolve(url)
      }
      // 非常见的图片地址发出警告
      const imgRegex = /\.(png|jpe?g|gif|bmp|svg)(\?.*)?$/
      if (!imgRegex.test(url)) {
        console.warn('非(png/jpe?g/gif/svg等)图片地址:' + url)
      } 

      const image = new Image()
      // 设置跨域问题
      image.crossOrigin = 'anonymous'
      // 图片地址
      image.src = url
      // console.log(image)
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height
        ctx && ctx.drawImage(image, 0, 0, image.width, image.height)
        // 获取图片后缀
        const lastDotIndex = url.lastIndexOf('.');
        const ext = lastDotIndex !== -1 ? url.substring(lastDotIndex + 1) : ''
        // 转base64
        const dataUrl = canvas.toDataURL(`image/${ext.toLowerCase()}`)
        // console.log(dataUrl)
        resolve(dataUrl || '')
      }
      // 失败处理
      image.onerror = (err) => {
        console.log(err)  
        reject('图片加载失败！')
      }
    })
  }

  static imgElementToBase64 = (img: HTMLImageElement) => {
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx && ctx.drawImage(img, 0, 0, img.width, img.height)
    // 获取图片后缀 
    const src = img.src
    const parts = src.split('.')
    let extension = parts[parts.length - 1]
    // 验证后缀 确保图片后缀合法
    extension = validImageExtensions.includes(extension) ? extension : 'jpg'
    // 转base64
    const dataUrl = canvas.toDataURL(`image/${extension}`)
    return dataUrl
  }

  destory() {
    this.promiseSequence = []
  }
}
