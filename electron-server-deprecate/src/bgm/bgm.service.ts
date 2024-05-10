import { Injectable } from '@nestjs/common'
import { AddBgmDto } from './dto/create-bgm.dto'
import { Bgm, BgmItem } from './entities/bgm.entity'
import { StorageService } from 'src/storage/storage.service'
import * as UUID from 'uuid'
import path from 'path'
import { PouchDBService } from 'src/pouchdb/pouchdb.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'

@Injectable()
export class BgmService {
  private bgmsRepository: PouchDB.Database<Bgm>
  constructor(
    // private readonly pouchDBService: PouchDBService,
    private readonly storageService: StorageService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {
    // this.bgmsRepository = this.pouchDBService.createDatabase<Bgm>('database/bgms')
  }
  initDatabase(pouchdb: PouchDB.Static) {
    this.bgmsRepository = new pouchdb<Bgm>('database/bgms', { auto_compaction: true })
  }
  /** 初始化 */
  async init(userId: string) {
    const bgm = new Bgm()
    bgm._id = UUID.v4()
    bgm.userId = userId
    bgm.list = []
    bgm.updateAt = new Date()
    bgm.createAt = new Date()
    await this.bgmsRepository.put(bgm)
    return this.bgmsRepository.get(bgm._id)
  }

  async fineOneByUserId(userId: string) {
    try {
      this.bgmsRepository.createIndex({ index: { fields: ['userId'] } })
      const timbres = await this.bgmsRepository.find({ selector: { userId: userId } })
      if (timbres.docs.length === 0) return null
      const timbre = timbres.docs[0]
      return timbre
    } catch (error) {
      this.userLogger.log(`查询用户音色库失败！${error.message}`)
      throw error
    }
  }

  async add(dto: AddBgmDto, userId: string, dirname: string) {
    try {
      const { audio, name } = dto
      const bgm = await this.fineOneByUserId(userId)
      const item: BgmItem = {
        id: UUID.v4(),
        name,
        audio: path.basename(audio)
      }
      if (!bgm.list) bgm.list = []
      bgm.list.push(item)
      await this.bgmsRepository.put(bgm)
      return item
    } catch (error) {
      throw error
    }
  }

  async remove(id: string, userId: string, dirname: string) {
    try {
      const bgm = await this.fineOneByUserId(userId)
      const index = bgm.list.findIndex(item => item.id === id)
      if (index === -1) return false
      const filename = bgm.list[index].audio
      bgm.list.splice(index, 1)
      await this.bgmsRepository.put(bgm)
      const filepath = this.storageService.getFilePath({
        dirname,
        filename,
        category: 'bgm'
      })
      this.storageService.deleteSync(filepath)
      return true
    } catch (error) {
      throw error
    }
  }

  async findAll(userId: string, dirname: string) {
    let bgm = await this.fineOneByUserId(userId)
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
