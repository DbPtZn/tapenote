import { Injectable } from '@nestjs/common'
import { CreateSpeakerDto } from './dto/create-speaker.dto'
import { UpdateSpeakerDto } from './dto/update-speaker.dto'
import { Speaker } from './entities/speaker.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { LoggerService } from 'src/logger/logger.service'
import path from 'path'
import { StorageService } from 'src/storage/storage.service'
import { SherpaService } from 'src/sherpa/sherpa.service'

@Injectable()
export class SpeakerService {
  constructor(
    @InjectRepository(Speaker)
    private speakersRepository: Repository<Speaker>,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly sherpaService: SherpaService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {}

  async create(createSpeakerDto: CreateSpeakerDto, userId: string, dirname: string) {
    const { role, name, avatar, changer } = createSpeakerDto
    try {
      const user = await this.userService.findOneById(userId)
      const speaker = new Speaker()
      speaker.userId = userId
      speaker.user = user
      speaker.type = role > 9999 ? 'human' : 'machine'
      speaker.role = role
      speaker.name = name
      speaker.avatar = path.basename(avatar)
      speaker.changer = changer ? changer : 0
      await this.speakersRepository.save(speaker)
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
      return speakers
    } catch (error) {
      throw error
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} speaker`
  // }

  // update(id: number, updateSpeakerDto: UpdateSpeakerDto) {
  //   return `This action updates a #${id} speaker`
  // }

  async remove(id: string, userId: string) {
    try {
      await this.speakersRepository.delete({ id, userId })
      this.userLogger.log(`删除说话人[${id}]配置成功`)
      return `This action removes a #${id} speaker`
    } catch (error) {
      throw error
    }
  }
}
