import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { aliConfig, commonConfig } from 'src/config'
import Client from '@alicloud/nls-filetrans-2018-08-17'

//地域ID，固定值。
let ENDPOINT = 'http://filetrans.cn-shanghai.aliyuncs.com'
let API_VERSION = '2018-08-17'

@Injectable()
export class AliService {
  private commom: ReturnType<typeof commonConfig>
  private aliConfig: ReturnType<typeof aliConfig>
  private appKey: string
  private secretId: string
  private secretKey: string
  constructor(
    private readonly configService: ConfigService
    // private readonly httpService: HttpService
  ) {
    this.commom = this.configService.get('common')
    this.aliConfig = this.configService.get('ali')
    this.appKey = this.aliConfig.appKey
    this.secretId = this.aliConfig.secretId
    this.secretKey = this.aliConfig.secretKey
    
    // 测试代码
    // this.fileTrans(this.secretId, this.secretKey, this.appKey, 'https://gw.alipayobjects.com/os/bmw-prod/0574ee2e-f494-45a5-820f-63aee583045a.wav')
  }

  fileTrans(akID: any, akSecret: any, appKey: any, fileLink: any) {
    //地域ID，固定值。
    const ENDPOINT = 'http://filetrans.cn-shanghai.aliyuncs.com'
    const API_VERSION = '2018-08-17'
    /**
     * 创建阿里云鉴权client
     */
    const client = new Client({
      accessKeyId: akID, //获取AccessKey ID和AccessKey Secret请前往控制台：https://ram.console.aliyun.com/manage/ak
      secretAccessKey: akSecret,
      endpoint: ENDPOINT,
      apiVersion: API_VERSION
    })
    /**
     * 提交录音文件识别请求，请求参数组合成JSON格式的字符串作为task的值。
     * 请求参数appkey：项目appkey，获取Appkey请前往控制台：https://nls-portal.console.aliyun.com/applist
     * 请求参数file_link：需要识别的录音文件。
     */
    const task = {
      appkey: appKey,
      file_link: fileLink,
      version: '4.0', // 新接入请使用4.0版本，已接入（默认2.0）如需维持现状，请注释掉该参数设置。
      enable_words: false, // 设置是否输出词信息，默认值为false，开启时需要设置version为4.0。
      enable_timestamp_alignment: true
    }
    const taskStr = JSON.stringify(task)
    const taskParams = {
      Task: taskStr
    }
    const options = {
      method: 'POST'
    }
    // 提交录音文件识别请求，处理服务端返回的响应。
    client
      .submitTask(taskParams, options)
      .then(response => {
        console.log(response)
        // 服务端响应信息的状态描述StatusText。
        let statusText = response.StatusText
        if (statusText != 'SUCCESS') {
          console.log('录音文件识别请求响应失败!')
          return
        }
        console.log('录音文件识别请求响应成功!')
        // 获取录音文件识别请求任务的TaskId，以供识别结果查询使用。
        let taskId = response.TaskId
        /**
         * 以TaskId为查询参数，提交识别结果查询请求。
         * 以轮询的方式进行识别结果的查询，直到服务端返回的状态描述为"SUCCESS"、SUCCESS_WITH_NO_VALID_FRAGMENT，
         * 或者为错误描述，则结束轮询。
         */
        let taskIdParams = {
          TaskId: taskId
        }
        let timer = setInterval(() => {
          client
            .getTaskResult(taskIdParams)
            .then(response => {
              console.log('识别结果查询响应：')
              console.log(response)
              let statusText = response.StatusText
              if (statusText == 'RUNNING' || statusText == 'QUEUEING') {
                // 继续轮询，注意间隔周期。
              } else {
                if (statusText == 'SUCCESS' || statusText == 'SUCCESS_WITH_NO_VALID_FRAGMENT') {
                  console.log('录音文件识别成功：')
                  let sentences = response.Result
                  console.log(sentences)
                } else {
                  console.log('录音文件识别失败!')
                }
                // 退出轮询
                clearInterval(timer)
              }
            })
            .catch(error => {
              console.error(error)
              // 异常情况，退出轮询。
              clearInterval(timer)
            })
        }, 10000)
      })
      .catch(error => {
        console.error(error)
      })
  }
  
}
