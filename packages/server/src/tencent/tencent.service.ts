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
import { commonConfig, tencentConfig } from 'src/config'
import randomstring from 'randomstring'
// 导入对应产品模块的client models。
const AsrClient = tencentcloud.asr.v20190614.Client
const TtsClient = tencentcloud.tts.v20190823.Client
const regex = /[!"#\$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~！￥…（）、—【】‘；：”“’。，？\s]/

@Injectable()
export class TencentService {
  private common: ReturnType<typeof commonConfig>
  asrClient: any
  ttsClient: any
  constructor(private readonly configService: ConfigService) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    const tencent = this.configService.get<ReturnType<typeof tencentConfig>>('tencent')
    // console.log(this.common.secretId, this.common.secretKey)
    // 实例化要请求产品(以cvm为例)的client对象
    this.asrClient = new AsrClient({
      // 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中，请参考本文凭证管理章节。
      // 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
      credential: {
        // secretId: this.common.secretId,
        // secretKey: this.common.secretKey
        secretId: tencent.secretId,
        secretKey: tencent.secretKey
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
      // SentenceWord: true
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
          // endpoint: "cvm.ap-shanghai.tencentcloudapi.com",
          // proxy: "http://127.0.0.1:8899" // http请求代理
        }
      }
    })
  }

  asr(filePath: string) {
    /** 语音自动识别 ASR */
    const voice = fs.readFileSync(filePath)
    const voiceBase64 = Buffer.from(voice).toString('base64')
    const req: SentenceRecognitionRequest = {
      EngSerViceType: '16k_zh',
      SourceType: 1,
      DataLen: voice.length,
      WordInfo: 2,
      Data: voiceBase64,
      VoiceFormat: 'ogg-opus'
    }
    return new Promise<{ text: string; tokens: string[]; timestamps: number[] }>((resolve, reject) => {
      try {
        this.asrClient.SentenceRecognition(req, (err, data) => {
          if (err) {
            console.error('腾讯语音识别发生错误1', err)
            reject(err)
          } else {
            // console.log(data)
            if(data.Result === '') return reject('识别结果为空')
            const list: { char: string; timestamp: number }[] = []
            let last = 0
            for (let i = 0; i < data.WordList.length; i++) {
              const item = data.WordList[i]
              const length = item.Word.length
              // 计算间隔值
              const interval = (item.EndTime - item.StartTime) / length
  
              // 针对英文单词字符串的处理
              if (typeof item.Word === 'string' && /[A-Za-z]/.test(item.Word)) {
                list.push({
                  char: item.Word,
                  timestamp: item.StartTime
                })
                // 记录时间戳
                last = item.StartTime + interval * (length - 1)
                continue
              }
              const chunk = Array.from(item.Word).map((word, index) => {
                // 对于标点符号
                if (typeof word === 'string' && word.length === 1 && regex.test(word)) {
                  if (data.WordList[i + 1]) {
                    return {
                      char: word,
                      timestamp: last + (data.WordList[i + 1].StartTime - last) / 2
                    }
                  }
                  return {
                    char: word,
                    timestamp: item.EndTime
                  }
                }
                const timestamp = item.StartTime + interval * index
                // 记录最后一个字符的时间戳
                if (index === length - 1) last = timestamp
                return {
                  char: word,
                  timestamp: timestamp
                }
              }) as { char: string; timestamp: number }[]
              list.push(...chunk)
            }
            const text = data.Result
            const tokens: string[] = []
            const timestamps: number[] = []
            list.forEach(item => {
              tokens.push(item.char)
              timestamps.push(parseFloat((item.timestamp / 1000).toFixed(3)))
            })
  
            resolve({
              text,
              tokens,
              timestamps
            })
          }
        })
      } catch (error) {
        console.error('腾讯语音识别发生错误2', error)
        reject(error)
      }
    })
  }

  // 音色列表：https://cloud.tencent.com/document/product/1073/92668
  tts(text: string, voiceType: number, Speed: number) {
    if (text.length === 0 || voiceType === undefined) throw '文本为空或未指定音色类型！'
    const sessionId = randomstring.generate(16)
    const req: TextToVoiceRequest = {
      SessionId: sessionId,
      Text: text,
      VoiceType: voiceType || 1001, // 音色
      SampleRate: 16000, // 采样率
      Codec: 'wav',
      Speed: Speed || 1,
      EnableSubtitle: true
    }
    return new Promise<{
      Audio: string
      Subtitles: {
        Text: string
        BeginTime: number
        EndTime: number
        BeginIndex: number
        EndIndex: number
        Phoneme: string
      }[]
    }>((resolve, reject) => {
      try {
        this.ttsClient.TextToVoice(req, (err, data) => {
          if (err) {
            console.error('腾讯语音合成发生错误1', err)
            reject(err)
          } else {
            // console.log(data)
            resolve(data)
          }
        })
      } catch (error) {
        console.error('腾讯语音合成发生错误2', error)
        reject(error)
      }
    })
  }
}
