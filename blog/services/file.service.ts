import path from 'path'
import fs from 'fs'
import randomstring from 'randomstring'
import child_process from 'child_process'
import { UploadFile } from '~/models'
import type { ObjectId } from 'mongoose'

type Category = 'audio' | 'image' | 'bgm' | 'logs'
const __rootdirname = process.cwd()

export class FileService {
  filesRepository: typeof UploadFile
  constructor() {
    this.filesRepository = UploadFile
  }

  getFilePath(args: { filename: string; dirname: string | string[]; category: Category }) {
    const { dirname, category, filename } = args
    const dir = typeof dirname === 'string' ? dirname : dirname.join('/')
    const dirPath = path.join(__rootdirname, 'public', dir, category)
    return `${dirPath}/${filename}`
  }

  saveImage(args: { sourcePath: string; extname: string; dirname: string }, userId: ObjectId) {
    const { sourcePath, extname, dirname } = args
    return new Promise<string>(async (resolve, reject) => {
      const { size, md5 } = await this.calculateFileStats(sourcePath)

      const file = await this.filesRepository.findOne({ md5, size, userId })
      if (file) {
        const isExists = fs.existsSync(file.path)
        if(isExists) {
          console.log('用户上传的图片已存在，直接返回图片路径!')
          resolve(file.path)
          return
        }
      }

      const filename = `${randomstring.generate(3)}${new Date().getTime()}.${extname}`
      const filepath = this.getFilePath({
        dirname,
        filename,
        category: 'image'
      })

      // 移动文件
      fs.rename(sourcePath, filepath, err => {
        if (err) {
          reject(err)
        } else {
          // 这里可以异步处理
          this.filesRepository.create({
            userId,
            name: filename,
            extname,
            type: 'image',
            path: filepath,
            size,
            md5,
          })

          resolve(filepath)
        }
      })
    })
  }

  async calculateFileStats(filePath: string): Promise<{ md5: string; size: number }> {
    return new Promise<{ md5: string; size: number }>((resolve, reject) => {
      // 创建子线程
      const child = child_process.fork('workers/md5-worker.mjs')

      // 向子线程发送消息
      child.send(filePath)

      // 设置超时 (10s)
      const timer = setTimeout(() => {
        child.kill()
        clearTimeout(timer)
      }, 10000)

      // 监听子线程发回的消息
      child.on('message', (msg: any) => {
        // console.log('child msg' + msg)
        if (msg.error) {
          // console.log(data.error)
          console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
          reject(msg.error)
        } else {
          resolve(msg)
        }
        clearTimeout(timer)
        child.kill()
      })

      // 监听子线程的错误
      child.on('error', error => {
        console.log(error)
        console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
        clearTimeout(timer)
        child.kill()
        reject(error)
      })
    })
  }
}

export const fileService = new FileService()
