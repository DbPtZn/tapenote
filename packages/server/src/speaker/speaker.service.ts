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
import * as UUID from 'uuid'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'
import fsx from 'fs-extra'

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
    private readonly logger: LoggerService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  async create(createSpeakerDto: CreateSpeakerDto, userId: string, dirname: string) {
    const { model, type, role, name, avatar, changer } = createSpeakerDto
    // console.log(createSpeakerDto)
    try {
      const user = await this.userService.findOneById(userId)
      const speaker = new Speaker()
      speaker.id = UUID.v4()
      speaker.userId = userId
      speaker.user = user
      speaker.model = model
      speaker.type = type === 'human' ? 'human' : 'machine'
      speaker.role = role
      speaker.name = name
      speaker.avatar = basename(avatar)
      speaker.changer = changer ? changer : 0
      // if (speaker.type === 'machine') {
      //   if(speaker.model === 'local-base-tts') {
      //     try {
      //       const txt = '哈库拉玛塔塔'
      //       const filepath = this.storageService.createLocalFilePath( `${speaker.id}.wav`, dirname)
      //       this.sherpaService.tts(txt, filepath, role, 1)
      //       speaker.audio = filepath
      //     } catch (error) {
      //       this.userLogger.error(`tts 测试失败`, error.message)
      //       throw error
      //     }
      //   }
      // }
      const result = await this.speakersRepository.save(speaker)
      delete result.user
      result.avatar = this.storageService.getResponsePath(result.avatar, dirname)
      return result
    } catch (error) {
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
      return speakers
    } catch (error) {
      this.userLogger.error(`查询 speakers 失败`, error.message)
      throw error
    }
  }

  async remove(id: string, userId: string) {
    try {
      await this.speakersRepository.delete({ id, userId })
      this.userLogger.log(`删除 speaker [${id}]配置成功`)
      return `This action removes a #${id} speaker`
    } catch (error) {
      throw error
    }
  }

  // TODO 可以使用 redis 存储来缓存优化
  async testTts(speakerId: number, model: string, speed = 1) {
    try {
      console.log(speakerId,model)
      const txt = '哈库拉玛塔塔'
      const filename = `${randomstring.generate(8)}.wav`
      const filepath= this.storageService.createLocalFilePath(filename ,'temp')
      switch (model) {
        case 'local-base-tts':
          await this.sherpaService.tts(txt, filepath, speakerId, speed)
          break
        case 'xunfei-base-tts':
          await this.sherpaService.tts(txt, filepath, speakerId, speed)
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
