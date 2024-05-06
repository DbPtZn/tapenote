import { Injectable } from '@nestjs/common'
import { AddRobotDto, AddRoleDto } from './dto/create-timbre.dto'
import { Timbre } from './entities/timbre.entity'
import { StorageService } from 'src/storage/storage.service'
import path from 'path'
import { SherpaService } from 'src/sherpa/sherpa.service'
import * as UUID from 'uuid'
import { PouchDBService } from 'src/pouchdb/pouchdb.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
/**
 * 关于 role 值
 * 0 为机器人默认保留的 role(speakerId) 值
 * 1 ~ 9998 为机器人角色 role(speakerId) 值
 * 9999 为默认角色保留的 role 值
 * >9999 为用户自定义角色 role 值
 */

@Injectable()
export class TimbreService {
  private timbresRepository: PouchDB.Database<Timbre>
  constructor(
    private readonly storageService: StorageService,
    private readonly sherpaService: SherpaService,
    private readonly pouchDBService: PouchDBService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {
    this.timbresRepository = this.pouchDBService.createDatabase<Timbre>('database/timbres', { auto_compaction: true })
  }

  /** 初始化 */
  async init(userId: string) {
    const timbre = new Timbre()
    timbre._id = UUID.v4()
    timbre.userId = userId
    timbre.role = 9999
    timbre.robot = 0
    timbre.roleList = []
    timbre.robotList = []
    await this.timbresRepository.put(timbre)
    return this.timbresRepository.get(timbre._id)
  }

  async fineOneByUserId(userId: string) {
    try {
      this.timbresRepository.createIndex({ index: { fields: ['userId'] } })
      const timbres = await this.timbresRepository.find({ selector: { userId: userId } })
      if (timbres.docs.length === 0) return null
      const timbre = timbres.docs[0]
      return timbre
    } catch (error) {
      this.userLogger.log(`查询用户音色库失败！${error.message}`)
      throw error
    }
  }

  async addRole(addRoleDto: AddRoleDto, userId: string) {
    try {
      this.userLogger.log(`正在添加角色音色...`)
      const timbre = await this.fineOneByUserId(userId)
      if (addRoleDto.role < 9999) throw new Error('角色的 role 值应大于 9999')
      if (timbre.roleList.some(role => role.key === addRoleDto.role)) throw new Error('角色已存在')
      const filename = path.basename(addRoleDto.avatar)
      timbre.roleList.push({
        key: addRoleDto.role,
        value: {
          name: addRoleDto.name,
          avatar: filename,
          changer: addRoleDto.changer
        }
      })
      this.userLogger.log(`添加角色音色成功！`)
      return this.timbresRepository.put(timbre)
    } catch (error) {
      this.userLogger.log(`添加角色音色失败！`)
      throw error
    }
  }

  async addRobot(addRobotDto: AddRobotDto, userId: string) {
    try {
      this.userLogger.log(`正在添加机器人音色...`)
      const timbre = await this.fineOneByUserId(userId)
      if (addRobotDto.role > 9999 && addRobotDto.role !== 0) throw new Error('机器人的 role 值应小于 9999 且不等于 0')
      if (timbre.robotList.some(role => role.key === addRobotDto.role)) throw new Error('角色已存在')
      const filename = path.basename(addRobotDto.avatar)
      timbre.robotList.push({
        key: addRobotDto.role,
        value: {
          name: addRobotDto.name,
          avatar: filename
        }
      })
      this.userLogger.log(`添加机器人音色成功！`)
      return this.timbresRepository.put(timbre)
    } catch (error) {
      this.userLogger.log(`添加机器人音色失败！${error.message}`)
      throw error
    }
  }

  async findAll(userId: string, dirname: string) {
    try {
      let timbre = await this.fineOneByUserId(userId)
      if (!timbre) {
        timbre = await this.init(userId)
      }
      timbre.roleList.forEach(role => {
        if (role.value.avatar) {
          const avatar = this.storageService.getFilePath({
            dirname,
            filename: role.value.avatar,
            category: 'image'
          })
          role.value.avatar = avatar
        }
      })
      timbre.robotList.forEach(role => {
        if (role.value.avatar) {
          const avatar = this.storageService.getFilePath({
            dirname,
            filename: role.value.avatar,
            category: 'image'
          })
          role.value.avatar = avatar
        }
      })
      return timbre
    } catch (error) {
      this.userLogger.error(`查询音色库失败！${error.message}`)
      throw error
    }
  }

  async remove(type: 'role' | 'robot', key: number, userId: string, dirname: string) {
    const timbre = await this.fineOneByUserId(userId)
    if (type === 'role') {
      const index = timbre.roleList.findIndex(role => role.key === key)
      if (index === -1) return false
      timbre.roleList.splice(index, 1)
      await this.timbresRepository.put(timbre)
      return true
    }
    if (type === 'robot') {
      const index = timbre.robotList.findIndex(role => role.key === key)
      // console.log(index)
      if (index === -1) return false
      timbre.robotList.splice(index, 1)
      await this.timbresRepository.put(timbre)
      return true
    }
  }

  async testRobot(speakerId: number, speed = 1) {
    const txt = '哈库拉玛塔塔'
    const { filepath } = this.storageService.createFilePath({
      dirname: 'temp',
      extname: '.wav',
      category: 'audio'
    })
    await this.sherpaService.tts(txt, filepath, speakerId, speed)
    return filepath
  }

  async clearTemp(url: string) {
    const originalname = path.basename(url)
    // console.log(originalname)
    const filepath = this.storageService.getFilePath({
      dirname: 'temp',
      filename: originalname,
      category: 'audio'
    })
    this.storageService.deleteSync(filepath)
  }
}
