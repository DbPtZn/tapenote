import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { StorageService } from 'src/storage/storage.service'
import { MongoRepository, Repository } from 'typeorm'
import { UploadFile } from './entities/file.entity'
// import { Worker } from 'worker_threads'
import child_process from 'child_process'
import { BucketService } from 'src/bucket/bucket.service'
import { basename, extname } from 'path'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import * as fs from 'fs'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
export interface LocalUploadFile extends Partial<Express.Multer.File> {
  filename: string
  path: string
  mimetype: 'image/jpeg' | 'image/png' | 'image/gif' | 'audio/wav' | 'audio/ogg' | string
  md5?: string
  // size: number
}
@Injectable()
export class UploadService {
  private common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(UploadFile)
    private uploadFilesRepository: Repository<UploadFile>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly bucketService: BucketService,
    private readonly userLoggerService: UserLoggerService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  /**
   * @param file >>>>
   * @param file_quoteId 引用对象的 id
   * @param file_removeLocalFile 上传完成后删除本地文件 仅云存储模式下生效
   * @param file_md5 文件md5 默认会自动计算md5 传入此参数的话会直接使用此参数，不会重新计算
   * @param file_ignore 忽略已存在文件检查
   * @param file_hadExists 文件已存在时的回调 (相同文本相同角色合成的语音文件可能是一样)
   * @param userId
   * @param dirname
   * @returns
   */
  async upload(
    arg: {
      file: LocalUploadFile
      removeLocalFile?: boolean
      quoteId?: string
      ignore?: boolean
      hadExists?: (url: string) => void
    },
    userId: string,
    dirname: string,
  ) {
    const { file, removeLocalFile, quoteId, ignore, hadExists } = arg
    try {
      if (!file.md5) {
        file.md5 = await this.calculateFileStats(file.path).catch(err => {
          throw new Error(`计算文件md5失败:${err.message}`)
        })
      }
      if (!file.size) {
        file.size = fs.statSync(file.path).size
      }
      if (!ignore) {
        const uploadfile = await this.uploadFilesRepository.findOneBy({ md5: file.md5, userId })
        if (uploadfile) {
          // console.log('用户上传的文件已存在，直接返回文件路径!')
          const url = this.storageService.getResponsePath(uploadfile.name, dirname)
          hadExists?.(url)
          return url
        }
      }
      const filepath = await this.storageService.save(file, dirname, removeLocalFile).catch(err => {
        throw new Error('保存文件失败')
      })
      const upload = new UploadFile()
      upload.name = basename(filepath)
      upload.dirname = dirname
      upload.path = filepath
      upload.userId = userId
      upload.mimetype = file.mimetype
      upload.md5 = file.md5
      upload.size = file.size
      upload.quote = quoteId ? [quoteId] : []
      await this.uploadFilesRepository.save(upload)
      this.userLoggerService.log(`用户上传文件成功，文件为：${upload.name}`)
      return this.storageService.getResponsePath(upload.name, dirname)
    } catch (error) {
      // console.log(error)
      this.userLoggerService.error(`用户上传文件失败，文件为：${file.filename}`, error.message)
      throw error
    }
  }

  async calculateFileStats(filePath: string) {
    return new Promise<string>((resolve, reject) => {
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
          console.log('警告！计算文件相关信息失败，未能成功创建文件数据对象，文件地址:', filePath, msg.error)
          reject(msg.error)
        } else {
          resolve(msg)
        }
        clearTimeout(timer)
        child.kill()
      })

      // 监听子线程的错误
      child.on('error', error => {
        console.log('警告！计算文件相关信息失败，未能成功创建文件数据对象，文件地址:', filePath, error.message)
        clearTimeout(timer)
        child.kill()
        reject(error)
      })
    })
  }
}
