import { Injectable } from '@nestjs/common'
import { basename, extname, join } from 'path'
import fs from 'fs'
import randomstring from 'randomstring'
import os from 'os'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { BucketService } from 'src/bucket/bucket.service'
import { LocalUploadFile } from 'src/upload/upload.service'
import { InjectRepository } from '@nestjs/typeorm'
import { UploadFile } from 'src/upload/entities/file.entity'
import { DataSource, Repository } from 'typeorm'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
// type Category = 'audio' | 'image' | 'bgm' | 'logs'
/**
 * 1. 对于一般文件，服务端不会返回完整的文件地址，只会返回相对路径，需要依据规则在客户端完成拼接
 * 2. 对于一般文件，如果需要在服务端进行加工，通过 getDir 、getFilePath 获取文件路径, 会根据配置自动获取本地或 cos 文件路径
 * 3. 对于一般文件，如果明确需要获取服务端本地路径，可以使用 getLocalFilePath 获取本地路径
 */


const __rootdirname = process.cwd()
@Injectable()
export class StorageService {
  private common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(UploadFile)
    private uploadFilesRepository: Repository<UploadFile>,
    private readonly configService: ConfigService,
    private readonly bucketService: BucketService,
    private readonly dataSource: DataSource
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  /** 获取本地目录 */
  getLocalDir(dirname: string, prv?: boolean) {
    // console.log('getUserDir:' + process.env.NODE_ENV)
    const common = this.common
    const dirPath = join(
      common.systemDir ? common.systemDir : __rootdirname,
      common.appDir,
      prv === true ? common.privateDir : common.publicDir,
      dirname
    )
    // console.log(dirPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  /**
   * 根据给定信息创建文件路径 (本地文件系统路径)
   */
  createLocalFilePath(filename: string, dirname: string, prv = false) {
    // const filename = path.basename(sourcePath)
    const dirPath = this.getLocalDir(dirname, prv)
    const filepath = `${dirPath}/${filename}`
    return filepath
  }

  /** 获取本地路径 */
  getLocalFilePath(filename: string, dirname: string, prv = false) {
    const dirPath = this.getLocalDir(dirname, prv)
    return `${dirPath}/${filename}`
  }

  /**
   * 获取目录（本地模式时，若目录不存在会自动创建目录）
   * @param dirname 用户目录名称
   * @param prv 是否为私密文件夹
   * @returns 文件存储目录
   */
  getDir(dirname: string, prv = false) {
    if (this.common.enableCOS) {
      return `${this.common.proxyDomain}/${dirname}`
    }
    const common = this.common
    const dirPath = join(
      prv === true ? common.fullPrivateDir : common.fullPublicDir,
      dirname
    )
    // console.log(dirPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  getFilePath(filename: string, dirname: string, prv = false) {
    const dirPath = this.getDir(dirname, prv)
    return `${dirPath}/${filename}`
  }

  /** 获取远程文件 */
  fetchRemoteFile(filename: string, dirname: string, output: string) {
    return this.bucketService.fetchFile(filename, dirname, output)
  }

  /**
   * 
   * @param file 
   * @param dirname 
   * @param removeFile 上传后删除文件，仅 cos 模式下有用
   * @returns 
   */
  save(file: LocalUploadFile, dirname: string, removeFile = true) {
    return new Promise<string>(async (resolve, reject) => {
      if (this.common.enableCOS) {
        this.bucketService
          .uploadFile(file, dirname)
          .then(res => {
            // console.log('file.filename:', file.filename)
            // console.log('file.originalname:', file.originalname)
            // console.log('file.path', file.path)
            const url = this.common.proxyDomain + '/' + dirname + '/' + basename(file.path)
            removeFile && fs.unlinkSync(file.path)
            console.log('cos url:', url)
            resolve(url)
          })
          .catch(err => {
            reject(err)
          })
      } else {
        const targetPath = this.createLocalFilePath(basename(file.path), dirname)
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
  createTempFilePath(ext: string, filename?: string) {
    const extWithoutDot = ext.charAt(0) === '.' ? ext.slice(1) : ext
    if(!filename) return join(os.tmpdir(), `${randomstring.generate(5)}-${new Date().getTime()}.${extWithoutDot}`)
    // const fileNameWithoutExt = filename.replace(path.extname(filename), '')
    const fileNameWithoutExt = basename(filename, extname(filename))
    console.log('fileNameWithoutExt:', fileNameWithoutExt)
    return join(os.tmpdir(), `${fileNameWithoutExt}.${extWithoutDot}`)
  }

  createCOSPath(pathOrName: string, dirname: string) {
    if (this.common.enableCOS) {
      return `${this.common.proxyDomain}/${dirname}/${basename(pathOrName)}`
    } else {
      return basename(pathOrName)
    }
  }

  getResponsePath(filename: string, dirname: string) {
    return `${this.common.staticPrefix}/${dirname}/${filename}`
  }

  /**
   * 删除文件
   * @param filename 文件名称
   * @param quoteId 引用 id
   * @param userId 用户 id
   * @param dirname 目录名称
   * @param prv 是否私有 默认false，仅本地存储时有效
   */
  async deleteFile(filename: string, quoteId: string, userId: string, dirname: string, prv = false) {
    // TODO 还应删除对应数据库中的对象
    const uploadfile = await this.uploadFilesRepository.findOne({
      where: {
        userId,
        name: filename
      }
    })
    if (!uploadfile) throw new Error('数据库未记录该文件信息')
    // 如果引用中包含项目id，则将该 id 从引用中移除
    const index = uploadfile.quote.indexOf(quoteId)
    if (index !== -1) uploadfile.quote.splice(index, 1)

    try {
      // 删除数据库中的记录
      if (uploadfile.quote.length !== 0) {
        // 如果尚有引用，则更新记录
        await this.uploadFilesRepository.save(uploadfile)
      } else {
        // 如果没有引用，则移除记录, 并删除具体文件
        await this.uploadFilesRepository.remove(uploadfile)
        // 删除具体文件
        try {
          if (this.common.enableCOS) {
            await this.bucketService.deleteObject(`${dirname}/${filename}`)
          } else {
            const filepath = this.getFilePath(filename, dirname, prv)
            fs.unlinkSync(filepath)
          }
        } catch (error) {
          console.log('移除文件数据库记录成功，但删除具体文件失败')
          // this.userLoggerService.error('移除文件数据库记录成功，但删除具体文件失败', error.message)
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 复制文件 (等价于 addQuote)
   * @param filename 
   * @param copyTargetId 
   * @param userId 
   */
  async copyFile(filename: string, copyTargetId: string, userId: string) {
    return this.addQuote(filename, copyTargetId, userId)
  }
  /**
   * 添加引用 (等价于 copyFile)
   * @param filename 
   * @param copyTargetId 
   * @param userId 
   * @returns 
   */
  async addQuote(filename: string, copyTargetId: string, userId: string) {
    try {
      const uploadfile = await this.uploadFilesRepository.findOneBy({
        userId,
        name: filename
      })
      if (!uploadfile) throw new Error('数据库未记录该文件信息')
      uploadfile.quote.push(copyTargetId)
      await this.uploadFilesRepository.save(uploadfile)
    } catch (error) {
      throw error
    }
  }

  /**
   * 剪贴文件 (等价于 updateQuote)
   * @param filename 文件名
   * @param sourceQuoteId 源引用
   * @param targetQuoteId 目标引用
   * @param userId 用户 id
   */
  async cutFile(filename: string, sourceQuoteId: string, targetQuoteId: string, userId: string) {
    this.updateQuote(filename, sourceQuoteId, targetQuoteId, userId)
  }

  /**
   * 更新引用 (等价于 cutFile)
   * @param filename 文件名
   * @param sourceQuoteId 源引用
   * @param targetQuoteId 目标引用
   * @param userId 用户 id
   */
  async updateQuote(filename: string, sourceQuoteId: string, targetQuoteId: string, userId: string) {
    try {
      const uploadfile = await this.uploadFilesRepository.findOneBy({
        userId,
        name: filename
      })
      if (!uploadfile) throw new Error('数据库未记录该文件信息')
      const index = uploadfile.quote.indexOf(sourceQuoteId)
      if (index !== -1) uploadfile.quote.splice(index, 1, targetQuoteId)
      await this.uploadFilesRepository.save(uploadfile)
    } catch (error){
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
