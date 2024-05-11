import { Injectable } from '@nestjs/common'
import { AddBgmDto } from './dto/create-bgm.dto'
import { Bgm, BgmItem } from './entities/bgm.entity'
import { ObjectId } from 'mongodb'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StorageService } from 'src/storage/storage.service'
import UUID from 'uuid'
import path from 'path'

@Injectable()
export class BgmService {
  constructor(
    @InjectRepository(Bgm)
    private bgmsRepository: Repository<Bgm>,
    private readonly storageService: StorageService
  ) {}
  /** 初始化 */
  init(userId: ObjectId) {
    const bgm = new Bgm()
    bgm._id = new ObjectId()
    bgm.userId = userId
    bgm.list = []
    return this.bgmsRepository.save(bgm)
  }

  async add(dto: AddBgmDto, userId: ObjectId, dirname: string) {
    const { audio, name } = dto
    const bgm = await this.bgmsRepository.findOneBy({ userId })
    const item: BgmItem = {
      id: UUID.v4(),
      name,
      audio: path.basename(audio)
    }
    bgm.list.push(item)
    await this.bgmsRepository.save(bgm)
    return item
  }

  async remove(id: string, userId: ObjectId, dirname: string) {
    const bgm = await this.bgmsRepository.findOneBy({ userId })
    const index = bgm.list.findIndex(item => item.id === id)
    if (index === -1) return false
    const filename = bgm.list[index].audio
    bgm.list.splice(index, 1)
    await this.bgmsRepository.save(bgm)
    const filepath = this.storageService.getFilePath({
      dirname,
      filename,
      category: 'bgm'
    })
    this.storageService.deleteSync(filepath)
    return true
  }

  async findAll(userId: ObjectId, dirname: string) {
    let bgm = await this.bgmsRepository.findOneBy({ userId })
    if (!bgm) {
      bgm = await this.init(userId)
    }
    bgm.list = bgm.list.map(item => {
      item.audio = this.storageService.getFilePath({
        dirname,
        filename: item.audio,
        category: 'bgm'
      })
      return item
    })
    return bgm
  }
}