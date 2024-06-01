import { Injectable } from '@nestjs/common'
import { CreateSpeakerDto } from './dto/create-speaker.dto'
import { Speaker } from './entities/speaker.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { LoggerService } from 'src/logger/logger.service'
import path from 'path'
import { StorageService } from 'src/storage/storage.service'
import { SherpaService } from 'src/sherpa/sherpa.service'
import { ConfigService } from '@nestjs/config'
import * as UUID from 'uuid'

@Injectable()
export class SpeakerService {
  constructor(
    @InjectRepository(Speaker)
    private speakersRepository: Repository<Speaker>,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly sherpaService: SherpaService,
    private readonly configService: ConfigService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {}

  async create(createSpeakerDto: CreateSpeakerDto, userId: string, dirname: string) {
    const { role, name, avatar, changer } = createSpeakerDto
    console.log(createSpeakerDto)
    try {
      const user = await this.userService.findOneById(userId)
      const speaker = new Speaker()
      speaker.id = UUID.v4()
      speaker.userId = userId
      speaker.user = user
      speaker.type = role > 9999 ? 'human' : 'machine'
      speaker.model =
        speaker.type === 'human'
          ? this.configService.get('sherpa.model.asr')
          : this.configService.get('sherpa.model.tts')
      speaker.role = role
      speaker.name = name
      speaker.avatar = path.basename(avatar)
      speaker.changer = changer ? changer : 0
      if (speaker.type === 'machine') {
        try {
          const txt = '哈库拉玛塔塔'
          const { filepath, filename } = this.storageService.createFilePath({
            dirname: dirname,
            category: 'audio',
            originalname: speaker.id,
            extname: '.wav'
          })
          this.sherpaService.tts(txt, filepath, role, 1)
          speaker.audio = filename
        } catch (error) {
          this.userLogger.error(`创建快速测试音频失败`, error.message)
          throw error
        }
      }
      const result = await this.speakersRepository.save(speaker)
      delete speaker.user
      result.avatar = avatar
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
      // const filepath = this.storageService.getFilePath({
      //   dirname,
      //   filename: speaker.avatar,
      //   category: 'image'
      // })
      // speaker.avatar = filepath
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
        const filepath = this.storageService.getFilePath({
          dirname,
          filename: speaker.avatar,
          category: 'image'
        })
        arr[index].avatar = filepath
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

  async testTts(speakerId: number, speed = 1) {
    try {
      const txt = '哈库拉玛塔塔'
      const { filepath } = this.storageService.createFilePath({
        dirname: 'temp',
        extname: '.wav',
        category: 'audio'
      })
      await this.sherpaService.tts(txt, filepath, speakerId, speed)
      return filepath
    } catch (error) {
      throw error
    }
  }

  async clearTemp(url: string) {
    try {
      const originalname = path.basename(url)
      const filepath = this.storageService.getFilePath({
        dirname: 'temp',
        filename: originalname,
        category: 'audio'
      })
      this.storageService.deleteSync(filepath)
    } catch (error) {
      throw error
    }
  }
}