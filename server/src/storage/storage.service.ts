import { Injectable } from '@nestjs/common'
import path from 'path'
import fs from 'fs'
import randomstring from 'randomstring'
import os from 'os'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
type Category = 'audio' | 'image' | 'bgm' | 'logs'
const __rootdirname = process.cwd()
@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}
  /**
   * 获取用户目录（不存在时自动创建）
   * @param dirname 用户目录名称
   * @param prv 是否为私密文件夹
   * @returns 文件存储目录
   */
  getUserDir(args: { dir: string | string[]; prv?: boolean }) {
    console.log('getUserDir:' + process.env.NODE_ENV)
    const { dir, prv } = args
    const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    const dirPath = path.join(
      common.appDir ? common.appDir : __rootdirname,
      common.userDir,
      prv === true ? common.privateDir : common.publicDir,
      typeof dir === 'string' ? dir : dir.join('/')
    )
    console.log(dirPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  /** 获取用户目录下的指定二级文件夹（不存在时自动创建） */
  getDocDir(args: { dir: string | string[]; category?: Category; prv?: boolean }) {
    const { dir, category, prv } = args
    const userDir = this.getUserDir({
      dir: typeof dir === 'string' ? dir : dir.join('/'),
      prv: prv === undefined ? false : prv
    })
    // console.log(userDir)
    const dirPath = category ? `${userDir}/${category}` : userDir
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  getFilePath(args: { filename: string; dirname: string | string[]; category: Category; prv?: boolean }) {
    const { dirname, category, filename, prv } = args
    const dir = typeof dirname === 'string' ? dirname : dirname.join('/')
    const dirPath = this.getDocDir({ dir, category, prv })
    return `${dirPath}/${filename}`
  }

  /**
   * 根据给定信息创建文件路径
   * @param dirname 目录名称
   * @param category 类目
   * @param originalname 原生文件名（或自定义文件名）（可选: 未传参时会根据当前时间自动生成文件名）
   * @param extname 拓展名
   * @returns filename: 文件名  filepath: 文件地址
   */
  createFilePath(args: {
    dirname: string | string[]
    category: Category
    originalname?: string
    extname: string | '.wav' | '.txt' | '.json'
    prv?: boolean
  }) {
    const { dirname, category, originalname, extname, prv } = args
    const dir =
      typeof dirname === 'string'
        ? dirname
        : dirname
            .map(s => s.trim()) // 去除包含空白字符在内的空字符串
            .filter(s => s)
            .join('/')
    const dirPath = this.getDocDir({ dir, category, prv })
    const filename = `${originalname ? originalname : createDtId()}` + `${extname}`
    const filepath = dirPath + '/' + filename
    return {
      filename,
      filepath
    }
  }

  saveImage(args: { sourcePath: string; extname: string; dirname: string }) {
    return new Promise<{ filepath: string; filename: string }>((resolve, reject) => {
      const { sourcePath, extname, dirname } = args
      const { filepath, filename } = this.createFilePath({
        dirname,
        originalname: `${randomstring.generate(3)}${new Date().getTime()}`,
        category: 'image',
        extname
      })
      // 移动文件
      fs.rename(sourcePath, filepath, err => {
        if (err) {
          reject(err)
        } else {
          resolve({ filepath, filename })
        }
      })
    })
  }

  /** 复制文件 */
  copyFile(sourcePath: string, targetPath: string, callback: (err) => void) {
    return fs.copyFile(sourcePath, targetPath, callback)
  }

  /** 同步复制文件 */
  copyFileSync(sourcePath: string, targetPath: string) {
    return fs.copyFileSync(sourcePath, targetPath)
  }

  /** 参数： 拓展名， 如 '.wav' */
  createTempFilePath(extname: string) {
    // const tempDir = tmpdir() // 获取系统临时目录路径 ((
    // const tempDir = 'temp'
    // const tempFileName = `temp-${Date.now()}${extname}` // 生成随机文件名
    // return path.join(process.cwd(), tempDir, tempFileName) // 拼接临时文件路径
    return path.join(os.tmpdir(), 'tempfile-' + Date.now() + extname)
  }

  deleteSync(filePath: string) {
    return fs.unlinkSync(filePath)
  }

  delete(filePath: string, callback: (err) => void) {
    return fs.unlink(filePath, callback)
  }
}

/**根据时间戳生成随机数*/
function createDtId() {
  const d = new Date()
  let year: any = d.getFullYear()
  let month: any = d.getMonth() + 1
  let date: any = d.getDate()
  const day = d.getDay()
  let hours: any = d.getHours()
  let minutes: any = d.getMinutes()
  let seconds: any = d.getSeconds()
  const ms = d.getMilliseconds()
  year = (year + '').substring(2)
  if (month <= 9) month = '0' + month
  if (date <= 9) date = '0' + date
  if (hours <= 9) hours = '0' + hours
  if (minutes <= 9) minutes = '0' + minutes
  if (seconds <= 9) seconds = '0' + seconds
  const num = Math.ceil(Math.random() * 100)
  const id = year + month + date + hours + minutes + seconds + num
  return `${randomstring.generate(3)}${id}`
}
