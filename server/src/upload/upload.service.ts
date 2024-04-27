import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { StorageService } from 'src/storage/storage.service'
import { MongoRepository } from 'typeorm'
import { UploadFile } from './entities/file.entity'
import { ObjectId } from 'mongodb'
import { Worker } from 'worker_threads'

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadFile)
    private uploadFilesRepository: MongoRepository<UploadFile>,
    private readonly storageService: StorageService
  ) {}
  async uploadImage(args: { sourcePath: string; extname: string; dirname: string; userId: ObjectId }) {
    const { sourcePath, extname, dirname, userId } = args
    return new Promise((resolve, reject) => {
      this.calculateFileStats(sourcePath)
        .then(async stats => {
          const { size, md5 } = stats
          const file = await this.uploadFilesRepository.findOneBy({ md5, size, userId })
          if (file) {
            console.log('用户上传的图片已存在，直接返回图片路径!')
            resolve(file.path)
            return
          }
          this.storageService
            .saveImage({ sourcePath, extname, dirname })
            .then(({ filename, filepath }) => {
              const image = new UploadFile()
              image._id = new ObjectId()
              image.name = filename
              image.path = filepath
              image.userId = userId
              image.type = extname
              image.md5 = md5
              image.size = size
              this.uploadFilesRepository.save(image)
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
      const worker = new Worker('./src/upload/workers/md5-worker.mjs', {
        workerData: { filePath }
      })

      worker.on('message', data => {
        if (data.error) {
          console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
          reject(new Error(data.error))
        } else {
          resolve(data)
        }
      })

      worker.on('error', error => {
        console.log('警告！计算图片相关信息失败，未能成功创建图片数据对象，图片地址:' + filePath)
        reject(error)
      })
    })
  }
}
