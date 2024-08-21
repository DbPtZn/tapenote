import { Injectable } from '@nestjs/common'
import path, { basename } from 'path'
import fs from 'fs'
import randomstring from 'randomstring'
import os from 'os'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { BucketService } from 'src/bucket/bucket.service'
import { LocalUploadFile } from 'src/upload/upload.service'
// type Category = 'audio' | 'image' | 'bgm' | 'logs'
const __rootdirname = process.cwd()
@Injectable()
export class StorageService {
  private common: ReturnType<typeof commonConfig>
  constructor(
    private readonly configService: ConfigService,
    private readonly bucketService: BucketService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }
  /**
   * 获取用户目录（不存在时自动创建）
   * @param dirname 用户目录名称
   * @param prv 是否为私密文件夹
   * @returns 文件存储目录
   */
  getDir(dir: string | string[], prv?: boolean) {
    // console.log('getUserDir:' + process.env.NODE_ENV)
    const common = this.common
    const dirPath = path.join(
      common.systemDir ? common.systemDir : __rootdirname,
      common.appDir,
      prv === true ? common.privateDir : common.publicDir,
      typeof dir === 'string' ? dir : dir.join('/')
    )
    // console.log(dirPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  getFilePath(args: { filename: string; dirname: string | string[]; prv?: boolean }) {
    const { dirname, filename, prv } = args
    const dir = typeof dirname === 'string' ? dirname : dirname.join('/')
    const dirPath = this.getDir(dir, prv)
    return `${dirPath}/${filename}`
  }

  /**
   * 根据给定信息创建文件路径 (本地文件系统路径)
   */
  createFilePath(
    args: {
      filename: string
      dirname: string | string[]
    },
    prv = false
  ) {
    const { dirname, filename } = args
    // const filename = path.basename(sourcePath)
    const dir =
      typeof dirname === 'string'
        ? dirname
        : dirname
            .map(s => s.trim()) // 去除包含空白字符在内的空字符串
            .filter(s => s)
            .join('/')
    const dirPath = this.getDir(dir, prv)
    const filepath = dirPath + '/' + filename
    return filepath
  }

  save(file: LocalUploadFile, dirname: string) {
    return new Promise<string>(async (resolve, reject) => {
      if (this.common.enableCOS) {
        this.bucketService
          .uploadFile(file, dirname)
          .then(res => {
            console.log(file.filename)
            console.log(file.originalname)
            console.log(file.path)
            const url = this.common.proxyDomain + '/' + dirname + '/' + basename(file.path)
            fs.unlinkSync(file.path)
            console.log(url)
            resolve(url)
          })
          .catch(err => {
            reject(err)
          })
      } else {
        const targetPath = this.createFilePath({ filename: path.basename(file.path), dirname })
        // 移动文件
        fs.rename(file.path, targetPath, err => {
          if (err) {
            reject(err)
          } else {
            resolve(targetPath)
          }
        })
      }
    })
  }

  /** 参数： 拓展名， 如 '.wav' */
  createTempFilePath(extname: string) {
    const extWithoutDot = extname.charAt(0) === '.' ? extname.slice(1) : extname
    return path.join(os.tmpdir(), `tempfile-${Date.now()}.${extWithoutDot}`)
  }

  createCOSPath(path: string, dirname: string) {
    if(this.common.enableCOS) {
      return `${this.common.proxyDomain}/${dirname}/${basename(path)}`
    } else {
      return basename(path)
    }
  }

  getResponsePath(path: string, dirname: string) {
    return this.common.enableCOS ? path :`${this.common.staticPrefix}/${dirname}/${basename(path)}`
  }

  /**
   * 删除文件
   * @param relativePath 相对路径 userDirname/projectDirname/filename
   * @param prv 是否私有 默认false，仅本地存储时有效
   */
  async deleteSync(relativePath: string, prv = false) {
    // TODO 还应删除对应数据库中的对象
    try {
      if(this.common.enableCOS) {
        await this.bucketService.deleteObject(relativePath)
      } else {
        // const path = this.getFilePath({ dirname, filename, prv })
        const common = this.common
        const filepath = path.join(
          common.systemDir ? common.systemDir : __rootdirname,
          common.appDir,
          prv === true ? common.privateDir : common.publicDir,
          relativePath
        )
        fs.unlinkSync(filepath)
      }
    } catch (error) {
      throw error
    }
  }
}
/** 复制文件 */
// copyFile(sourcePath: string, targetPath: string, callback: (err) => void) {
//   return fs.copyFile(sourcePath, targetPath, callback)
// }

/** 同步复制文件 */
// copyFileSync(sourcePath: string, targetPath: string) {
//   return fs.copyFileSync(sourcePath, targetPath)
// }

// deleteSync(filePath: string) {
//   return fs.unlinkSync(filePath)
// }

// delete(filePath: string, callback: (err) => void) {
//   return fs.unlink(filePath, callback)
// }
/** 获取用户目录下的指定二级文件夹（不存在时自动创建） */
// getDocDir(args: { dir: string | string[]; prv?: boolean }) {
//   const { dir, prv } = args
//   const userDir = this.getUserDir({
//     dir: typeof dir === 'string' ? dir : dir.join('/'),
//     prv: prv === undefined ? false : prv
//   })
//   // console.log(userDir)
//   const dirPath = userDir
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true })
//   }
//   return dirPath
// }
/**根据时间戳生成随机数*/
// function createDtId() {
//   const d = new Date()
//   let year: any = d.getFullYear()
//   let month: any = d.getMonth() + 1
//   let date: any = d.getDate()
//   const day = d.getDay()
//   let hours: any = d.getHours()
//   let minutes: any = d.getMinutes()
//   let seconds: any = d.getSeconds()
//   const ms = d.getMilliseconds()
//   year = (year + '').substring(2)
//   if (month <= 9) month = '0' + month
//   if (date <= 9) date = '0' + date
//   if (hours <= 9) hours = '0' + hours
//   if (minutes <= 9) minutes = '0' + minutes
//   if (seconds <= 9) seconds = '0' + seconds
//   const num = Math.ceil(Math.random() * 100)
//   const id = year + month + date + hours + minutes + seconds + num
//   return `${randomstring.generate(3)}${id}`
// }
