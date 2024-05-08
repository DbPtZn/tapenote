import { Injectable } from '@nestjs/common'
import { StorageService } from 'src/storage/storage.service'
import { UploadFile } from './entities/file.entity'
import { Worker } from 'worker_threads'
import * as UUID from 'uuid'
import child_process from 'child_process'
@Injectable()
export class UploadService {
  private uploadFilesRepository: PouchDB.Database<UploadFile>
  constructor(
    // private readonly pouchDBService: PouchDBService,
    private readonly storageService: StorageService
  ) {
    // this.uploadFilesRepository = this.pouchDBService.createDatabase('database/uploadFiles', { auto_compaction: true })
  }
  initDatabase(pouchdb: PouchDB.Static) {
    this.uploadFilesRepository = new pouchdb<UploadFile>('database/uploadFiles', { auto_compaction: true })
  }
  async findOneBy(obj: { [key: string]: any }) {
    const keys = Object.keys(obj)
    if (keys.length === 0) throw new Error('参数不能为空')
    await this.uploadFilesRepository.createIndex({
      index: {
        fields: keys
      }
    })
    const result = await this.uploadFilesRepository.find({
      selector: {
        $and: keys.map(key => {
          return {
            [key]: obj[key]
          }
        })
      },
      limit: 1
    })
    return result.docs.length > 0 ? result.docs[0] : undefined
  }

  async uploadImage(args: { sourcePath: string; extname: string; dirname: string; userId: string }) {
    const { sourcePath, extname, dirname, userId } = args
    return new Promise((resolve, reject) => {
      this.calculateFileStats(sourcePath)
        .then(async stats => {
          const { size, md5 } = stats
          const file = await this.findOneBy({ md5, size, userId })
          if (file) {
            console.log('用户上传的图片已存在，直接返回图片路径!')
            resolve(file.path)
            return
          }
          this.storageService
            .saveImage({ sourcePath, extname, dirname })
            .then(({ filename, filepath }) => {
              const image = new UploadFile()
              image._id = UUID.v4()
              image.name = filename
              image.path = filepath
              image.userId = userId
              image.type = extname
              image.md5 = md5
              image.size = size
              this.uploadFilesRepository.put(image)
              resolve(filepath)
            })
            .catch(error => {
              console.log('警告！保存图片失败，未能成功创建图片数据对象，源图片地址:' + sourcePath)
              reject(error)
            })
        })
        .catch(async error => {
          const { filepath } = await this.storageService.saveImage({ sourcePath, extname, dirname })
          console.log('警告！计算图片相关信息失败,该图片未能被数据库记录，图片地址：' + filepath)
          resolve(filepath)
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
