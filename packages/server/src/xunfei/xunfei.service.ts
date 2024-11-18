import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { commonConfig, xunfeiConfig } from 'src/config'
import * as crypto from 'crypto'
import fs from 'fs'
import { basename } from 'path'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class XunfeiService {
  private commom: ReturnType<typeof commonConfig>
  private xunfeiConfig: ReturnType<typeof xunfeiConfig>
  private secretId: string
  private secretKey: string
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.commom = this.configService.get('common')
    this.xunfeiConfig = this.configService.get('xunfei')
    this.secretId = this.xunfeiConfig.secretId
    this.secretKey = this.xunfeiConfig.secretKey
  }

  /** signa 的生成公式：HmacSHA1(MD5(secretId + ts)，secretkey) */
  generateSigna() {
    // 1. baseString 由 secretId 和当前时间戳 ts 拼接而成
    const date = new Date()
    const timestamp = date.getTime()
    const baseString = `${this.secretId}${timestamp}`
    // 2. 对 baseString 进行 MD5
    const md5 = crypto.createHash('md5').update(baseString).digest('hex')
    // 3. 以 secret key 为 key 对 MD5 之后的 baseString 进行 HmacSHA1 加密
    const param = crypto.createHmac('sha1', this.secretKey).update(md5).digest()
    // 4. 对加密后的字符串进行 base64 编码
    const signa = Buffer.from(param).toString('base64')
    return signa
  }

  // 文档：https://www.xfyun.cn/doc/asr/ifasr_new/API.html#_1%E3%80%81%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0
  async useASR(filePath: string, duration: number) {
    // try {
    //   const voice = fs.readFileSync(filePath)

    //   const resp = await this.httpService.axiosRef.post('https://raasr.xfyun.cn/v2/api/upload', {
    //     headers: {
    //       'Content-Type': 'application/octet-stream'
    //     },
    //     params: {
    //       fileName: basename(filePath),
    //       fileSize: voice.length,
    //       duration: duration,
    //       signa: this.generateSigna(),
    //       callbackUrl: `${this.commom}`
    //     },
    //     data: voice
    //   })
    // } catch (error) {
      
    // }
  }
}
