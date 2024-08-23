import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { StorageService } from 'src/storage/storage.service'
import { MongoRepository, Repository } from 'typeorm'
import { UploadFile } from './entities/file.entity'
// import { Worker } from 'worker_threads'
import child_process from 'child_process'
import * as UUID from 'uuid'
import { BucketService } from 'src/bucket/bucket.service'
import { basename, extname } from 'path'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import * as fs from 'fs'
export interface LocalUploadFile extends Partial<Express.Multer.File> {
  filename: string
  path: string
  mimetype: 'image/jpeg' | 'image/png' | 'audio/wav' | string
  // md5: string
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
    private readonly bucketService: BucketService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  // async upload(file: any, filename: string, dirname: string) {
  //   console.log(file)
  //   console.log(filename)
  //   return this.bucketService.uploadFile(file, filename, dirname)
  // }

  async upload(file: LocalUploadFile, userId: string, dirname: string, quoteId?: string) {
    try {
      const md5 = await this.calculateFileStats(file.path).catch(err => {
        throw new Error('计算图片md5失败')
      })
      if(!file.size) {
        file.size = fs.statSync(file.path).size
      }
      const uploadfile = await this.uploadFilesRepository.findOneBy({ md5, userId })
      if (uploadfile) {
        console.log('用户上传的图片已存在，直接返回图片路径!')
        return this.storageService.getResponsePath(uploadfile.name, dirname)
      }
      const filepath = await this.storageService.save(file, dirname).catch(err => {
        throw new Error('保存图片失败')
      })
      const upload = new UploadFile()
      upload.name = basename(filepath)
      upload.dirname = dirname
      upload.path = filepath
      upload.userId = userId
      upload.mimetype = file.mimetype
      upload.md5 = md5
      upload.size = file.size
      upload.quote = quoteId ? [quoteId] : []
      await this.uploadFilesRepository.save(upload)
      // return `${this.common.staticPrefix}/${dirname}/${upload.name}`
      return this.storageService.getResponsePath(upload.name, dirname)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // async localUpload(file: LocalUploadFile, userId: string, dirname: string) {
  //   try {
  //     const md5 = await this.calculateFileStats(file.path).catch(err => {
  //       throw new Error('计算图片md5失败')
  //     })
  //     const size = fs.statSync(file.path).size
  //     const uploadfile = await this.uploadFilesRepository.findOneBy({ md5, userId })
  //     if (uploadfile) {
  //       console.log('用户上传的图片已存在，直接返回图片路径!')
  //       return uploadfile.path
  //     }
  //     const filepath = await this.storageService.save(file, dirname).catch(err => {
  //       throw new Error('保存图片失败')
  //     })
  //     const upload = new UploadFile()
  //     upload.name = basename(filepath)
  //     upload.path = filepath
  //     upload.userId = userId
  //     upload.mimetype = file.mimetype
  //     upload.md5 = md5
  //     upload.size = size
  //     upload.quote = []
  //     await this.uploadFilesRepository.save(upload)
  //     return this.common.enableCOS ? filepath : `${this.common.staticPrefix}/${filepath.split(this.common.publicDir)[1]}`
  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }
  // }

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

  // async calculateFileStats(filePath: string): Promise<{ md5: string; size: number }> {
  //   return new Promise<{ md5: string; size: number }>((resolve, reject) => {
  //     const worker = new Worker('./src/upload/workers/md5-worker.mjs', {
  //       workerData: { filePath }
  //     })

  //     // 设置超时 (10s)
  //     const timer = setTimeout(() => {
  //       worker.terminate()
  //       clearTimeout(timer)
  //     }, 10000)

  //     worker.on('message', data => {
  //       if (data.error) {
  //         console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
  //         reject(new Error(data.error))
  //       } else {
  //         resolve(data)
  //       }
  //       clearTimeout(timer)
  //       worker.terminate()
  //     })

  //     worker.on('error', error => {
  //       console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
  //       worker.terminate()
  //       clearTimeout(timer)
  //       reject(error)
  //     })
  //   })
  // }
}
