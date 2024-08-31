import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import COS from 'cos-nodejs-sdk-v5'
import { commonConfig } from 'src/config'
import fsx from 'fs-extra'
import { basename } from 'path'
import { LocalUploadFile } from 'src/upload/upload.service'

// 腾讯 cos node sdk 使用说明 https://cloud.tencent.com/document/product/436/8629
@Injectable()
export class BucketService {
  private cos: COS
  private common: ReturnType<typeof commonConfig>
  constructor(private readonly configService: ConfigService) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    // 详细参数参考：https://cloud.tencent.com/document/product/436/8629
    // console.log(this.common.Bucket, this.common.Region)
    this.cos = new COS({
      // 必选参数
      SecretId: this.common.secretId,
      SecretKey: this.common.secretKey
      // 可选参数
      // FileParallelLimit: 3, // 设置最大上传并发数
      // ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
      // ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
      // Proxy: '',
      // Protocol: 'https:',
      // Timeout: 10000,
    })
  }

  async uploadFile(file: LocalUploadFile, dirname: string) {
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.common.bucket,
          Region: this.common.region,
          Key: `${dirname}/${basename(file.path)}`,
          Body: fsx.createReadStream(file.path),
          ContentType: file.mimetype
          // onProgress: (progressData) => {
          //   console.log(JSON.stringify(progressData))
          // }
        },
        (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(data)
            resolve(data)
          }
        }
      )
      // this.cos.uploadFile({}, (err, data) => {
      //   if (err) {
      //     reject(err)
      //   } else {
      //     resolve(data)
      //   }
      // })
    })
  }

    /**
   * 获取私有文件
   * @param filename 文件名 
   * @param dirname 目录名
   * @param output 输出路径
   * @returns data
   */
    async fetchFile(filename: string, dirname: string, output: string) {
      return new Promise((resolve, reject) => {
        this.cos.getObject(
          {
            Bucket: this.common.bucket,
            Region: this.common.region,
            Key: `${dirname}/${filename}`,
            Output: fsx.createWriteStream(output),
          },
          function (err, data) {
            console.log(err)
            if(err) {
              reject(err)
            }
            resolve(data)
          }
        )
      })
    }

  async deleteObject(path: string) {
    return new Promise((resolve, reject) => {
      this.cos.deleteObject(
        {
          Bucket: this.common.bucket, // 存储桶名称
          Region: this.common.region, // 存储桶所在地域，必须字段
          Key: path // 文件相对路径
        },
        (err, data) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(data)
            resolve(data)
          }
        }
      )
    })
  }
}
