import { Injectable } from '@nestjs/common'
import * as tencentcloud from 'tencentcloud-sdk-nodejs'
import {
  SentenceRecognitionRequest,
  SentenceWord
} from 'tencentcloud-sdk-nodejs/tencentcloud/services/asr/v20190614/asr_models'
import { TextToVoiceRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tts/v20190823/tts_models'
import fs, { ReadStream } from 'fs'
import { ConfigService } from '@nestjs/config'
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/asr/v20190614/asr_client'
import { commonConfig } from 'src/config'
// 导入对应产品模块的client models。
const AsrClient = tencentcloud.asr.v20190614.Client
const TtsClient = tencentcloud.tts.v20190823.Client
@Injectable()
export class CvmService {
  private common: ReturnType<typeof commonConfig>
  asrClient: any
  ttsClient: any
  constructor(private readonly configService: ConfigService) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    // 实例化要请求产品(以cvm为例)的client对象
    this.asrClient = new AsrClient({
      // 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中，请参考本文凭证管理章节。
      // 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
      credential: {
        secretId: this.common.secretId,
        secretKey: this.common.secretKey
      },
      // 产品地域
      region: 'ap-shanghai',
      // 可选配置实例
      profile: {
        signMethod: 'TC3-HMAC-SHA256', // 签名方法
        httpProfile: {
          reqMethod: 'POST', // 请求方法
          reqTimeout: 30 // 请求超时时间，默认60s
          // proxy: "http://127.0.0.1:8899" // http请求代理
        }
      }
    })

    this.ttsClient = new TtsClient({
      // 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中，请参考本文凭证管理章节。
      // 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
      credential: {
        secretId: this.common.secretId,
        secretKey: this.common.secretKey
      },
      // 产品地域
      region: 'ap-shanghai',
      // 可选配置实例
      profile: {
        signMethod: 'TC3-HMAC-SHA256', // 签名方法
        httpProfile: {
          reqMethod: 'POST', // 请求方法
          reqTimeout: 30 // 请求超时时间，默认60s
          // proxy: "http://127.0.0.1:8899" // http请求代理
        }
      }
    })
  }

  useASR(filePath: string) {
    /** 语音自动识别 ASR */
    const voice = fs.readFileSync(filePath)
    const voiceBase64 = Buffer.from(voice).toString('base64')
    const req: SentenceRecognitionRequest = {
      EngSerViceType: '16k_zh',
      SourceType: 1,
      Data: voiceBase64,
      VoiceFormat: 'wav'
    }
    return new Promise<string | null>((resolve, reject) => {
      this.asrClient.SentenceRecognition(req, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(data.Result)
        }
      })
    })
  }

  useTTS(text: string, voiceType: number) {
    if (text.length === 0 || !voiceType) throw '文本为空或未指定音色类型！'
    const sessionId = Randomstring.generate(16)
    const req: TextToVoiceRequest = {
      SessionId: sessionId,
      Text: text,
      VoiceType: voiceType, // 音色
      SampleRate: 16000, // 采样率
      Codec: 'wav',
      EnableSubtitle: true
    }
    return new Promise<string>((resolve, reject) => {
      this.ttsClient.TextToVoice(req, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.Audio)
        }
      })
    })
  }
}
