import { Observable, Subject, Injectable } from '@textbus/core'

export interface IUploadFunction {
  (base64Data: string): Promise<string>
}

interface Task {
  base64Data: string
  resolve: (url: string) => void
  reject: (err: Error) => void
}

@Injectable()
export class ImgToUrlService {
  private uploadFunction: IUploadFunction | undefined = undefined
  private finishEvent: Subject<number> = new Subject()
  onFinish: Observable<any> = this.finishEvent.asObservable()
  private errorEvent: Subject<any> = new Subject()
  onError: Observable<any> = this.errorEvent.asObservable()
  queue: Task[]

  tasks: number // 当前运行的任务数
  maxConcurrency: number // 最大并行任务数
  isRunning: number // 当前运行的任务数
  constructor() {
    this.tasks = 0
    this.isRunning = 0
    this.queue = []
    this.maxConcurrency = 6
  }

  setup(uploadFunction: IUploadFunction, maxConcurrency = 6) {
    this.uploadFunction = uploadFunction
    this.maxConcurrency = maxConcurrency
  }

  /** 加入图片转化的进程 (需要同时处理多张图片的情况) */
  addUploadProcess(base64Data: string, success: (url: string) => void, error?: (err: any) => void) {
    this.addTask(base64Data)
      .then(url => {
        success(url)
      })
      .catch(err => {
        error?.(err)
      })
  }

  /** 独立上传图片 (在图片工具中上传图片时使用) */
  uploadImg(base64Data: string) {
    if (!this.uploadFunction) return Promise.reject(new Error('未设置上传函数'))
    return this.uploadFunction(base64Data)
  }

  /** 添加任务 */
  private addTask(base64Data: string) {
    if (!this.uploadFunction) return Promise.reject(new Error('未设置上传函数'))
    this.tasks++
    return new Promise<string>((resolve, reject) => {
      this.queue.push({ base64Data, resolve, reject })
      this.processQueue()
    })
  }

  // 处理队列中的上传任务(当前上传任务大于 this.maxConcurrency 时会进入等待)
  private processQueue() {
    if (this.queue.length > 0 && this.isRunning < this.maxConcurrency) {
      // console.log('this.isRunning', this.isRunning)
      const task = this.queue.shift()
      this.isRunning++
      task &&
        this.uploadTask(task)!
          .then(() => {
            // 上传任务完成后，递归调用 processQueue 继续处理队列
            this.isRunning--
            this.checkProcess()
            this.processQueue()
          })
          .catch(error => {
            console.error('Upload failed:', error)
            this.isRunning--
            this.checkProcess()
            this.error(error)
            this.processQueue()
          })
    } else if (this.queue.length === 0) {
      // 如果队列为空且没有正在运行的任务，则可以输出一些日志信息
      // console.log('Queue is empty. All tasks completed.')
    }
  }

  /** 任务完成 */
  private finish() {
    this.finishEvent.next(this.tasks)
    this.tasks = 0
  }

  /** 任务出错 */
  private error(msg: string) {
    const err = new Error(msg)
    this.errorEvent.next(err)
  }

  /** 检查进度： 如果任务数为0，任务完成 */
  private checkProcess() {
    if (this.isRunning === 0) this.finish()
  }

  // 执行单个上传任务
  private uploadTask(task: Task) {
    return this.uploadFunction!(task.base64Data)
      .then(url => {
        task.resolve(url)
      })
      .catch(err => {
        task.reject(err)
      })
  }

  static isBase64(str: string) {
    // const regex = /^data:image\/([a-zA-Z]+);base64,/
    const regex = /^data:image\/.*;base64,/i
    return regex.test(str)
  }

  destory() {
    this.queue = []
    this.tasks = 0
    this.isRunning = 0
  }
}
