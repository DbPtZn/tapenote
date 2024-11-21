import { Injectable } from '@nestjs/common'
import { CreateSpeakerDto } from './dto/create-speaker.dto'
import { Speaker } from './entities/speaker.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { LoggerService } from 'src/logger/logger.service'
import path, { basename, dirname } from 'path'
import { StorageService } from 'src/storage/storage.service'
import { SherpaService } from 'src/sherpa/sherpa.service'
import { ConfigService } from '@nestjs/config'
import { uuidv7 } from 'uuidv7'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'
import fsx from 'fs-extra'
import { TencentService } from 'src/tencent/tencent.service'
import { AsrModel, TtsModel } from 'src/enum'

const ttsOptions = [
  { label: '基础语音合成-女声 (免费)', value: TtsModel.Local, msg: '基础女声支持 0 ~ 186 音色值调控' },
  { label: '腾讯语音合成 (会员)', value: TtsModel.Tencent, msg: '详见腾讯语音合成音色表' }
    // { label: '讯飞语音合成 (会员)', value: 'xunfei-base-tts' },
]

const asrOptions = [
  { label: '基础语音识别 (免费)', value: AsrModel.Local, msg: '' },
  { label: '腾讯语音识别 (会员)', value: AsrModel.Tencent, msg: '' }
   // { label: '讯飞语音识别 (会员)', value: 'xunfei-base-asr' },
]

const tencentTtsTimbreLanguageMap = new Map<number, string[]>([
  [ 10510000, ["zh-CN"]],
  [ 1001, ["zh-CN"]],
  [ 1002, ["zh-CN"]],
  [ 1003, ["zh-CN"]],
  [ 1004, ["zh-CN"]],
  [ 1005, ["zh-CN"]],
  [ 1008, ["zh-CN"]],
  [ 1009, ["zh-CN"]],
  [ 1010, ["zh-CN"]],
  [ 1017, ["zh-CN"]],
  [ 1018, ["zh-CN"]],
  [ 1050, ["en-US"]],
  [ 1051, ["en-US"]]
])

function getLanguage(type: 'human' | 'machine', value?: { model: string, role: number }) {
  if(type === 'human') {
    return ['zh-CN', 'en-US'] // 目前语音识别的本地模型和付费模型都支持中英文
  }
  if(type === 'machine' && value) {
    if (value.model === AsrModel.Local) {
      return ['zh-CN'] // 本地语音合成模型只支持中文
    }
    if (value.model === AsrModel.Tencent) {
      const language = tencentTtsTimbreLanguageMap.get(value.role)
      return language || []
    }
  }
  return []
}

@Injectable()
export class SpeakerService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(Speaker)
    private speakersRepository: Repository<Speaker>,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly sherpaService: SherpaService,
    private readonly configService: ConfigService,
    private readonly userLogger: UserLoggerService,
    private readonly tencentService: TencentService,
    private readonly logger: LoggerService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  async create(createSpeakerDto: CreateSpeakerDto, userId: string, dirname: string) {
    const { model, type, role, name, speed, avatar, changer } = createSpeakerDto
    // console.log(createSpeakerDto)
    try {
      const user = await this.userService.findOneById(userId)
      const speaker = new Speaker()
      speaker.userId = userId
      speaker.user = user
      speaker.model = model
      speaker.type = type === 'human' ? 'human' : 'machine'
      speaker.language = getLanguage(type, { model, role })
      speaker.role = role || 0
      speaker.name = name
      speaker.avatar = basename(avatar)
      speaker.changer = changer || 0
      speaker.speed = speed || 1
      const result = await this.speakersRepository.save(speaker)
      delete result.user
      result.avatar = this.storageService.getResponsePath(result.avatar, dirname)
      this.userLogger.log(`创建 speaker 成功,speaker id:${result.id}`)
      return result
    } catch (error) {
      console.log(error)
      this.userLogger.error(`创建 speaker 失败`, error.message)
      throw error
    }
  }

  async findOneById(id: string, userId: string, dirname: string) {
    try {
      const speaker = await this.speakersRepository.findOne({
        where: { id, userId }
      })
      return speaker
    } catch (error) {
      this.userLogger.error(`查询 speaker 失败`, error.message)
      throw error
    }
  }

  async findAll(userId: string, dirname: string) {
    try {
      const speakers = await this.speakersRepository.find({
        where: { userId }
      })
      speakers.forEach((speaker, index, arr) => {
        arr[index].avatar = this.storageService.getResponsePath(speaker.avatar, dirname)
      })
      this.userLogger.log(`查询 speakers 成功`)
      return {
        speakers,
        ttsOptions,
        asrOptions
      }
    } catch (error) {
      this.userLogger.error(`查询 speakers 失败`, error.message)
      throw error
    }
  }

  async remove(id: string, userId: string) {
    try {
      await this.speakersRepository.delete({ id, userId })
      this.userLogger.log(`删除 speaker [${id}]成功`)
      return `This action removes a #${id} speaker`
    } catch (error) {
      this.userLogger.error(`删除 speaker [${id}]失败`, error.message)
      throw error
    }
  }

  // TODO 可以使用 redis 存储来缓存优化
  async testTts(speakerId: number, model: string, speed = 1) {
    try {
      console.log(speakerId, model)
      const txt = '欢迎使用笔记映画工具，祝您生活愉快！'
      const filename = `${randomstring.generate(8)}.wav`
      const filepath= this.storageService.createLocalFilePath(filename ,'temp')
      switch (model) {
        case 'local-base-tts':
          await this.sherpaService.tts(txt, filepath, speakerId, speed)
          break
        case 'tencent-base-tts':
          const data = await this.tencentService.tts(txt, speakerId, speed)
          const buffer = Buffer.from(data.Audio, 'base64')
          fsx.writeFileSync(filepath, buffer)
          break
        default:
          throw new Error('不支持该目标模型')
      }  
      return `${this.common.staticResourcePrefix}/temp/${filename}`
    } catch (error) {
      throw error
    }
  }

  async clearTemp(url: string) {
    try {
      const filepath = `${this.storageService.getDir('temp')}/${basename(url)}`
      fsx.removeSync(filepath)
    } catch (error) {
      throw error
    }
  }
}
