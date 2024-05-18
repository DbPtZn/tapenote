import { Injectable } from '@nestjs/common'
import { AddRobotDto, AddRoleDto } from './dto/create-timbre.dto'
import { Timbre } from './entities/timbre.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StorageService } from 'src/storage/storage.service'
import path from 'path'
import { SherpaService } from 'src/sherpa/sherpa.service'
import * as UUID from 'uuid'
import { User } from 'src/user/entities/user.entity'
/**
 * 关于 role 值
 * 0 为机器人默认保留的 role(speakerId) 值
 * 1 ~ 9998 为机器人角色 role(speakerId) 值
 * 9999 为默认角色保留的 role 值
 * >9999 为用户自定义角色 role 值
 */

@Injectable()
export class TimbreService {
  constructor(
    @InjectRepository(Timbre)
    private timbresRepository: Repository<Timbre>,
    private readonly storageService: StorageService,
    private readonly sherpaService: SherpaService
  ) {}

  /** 初始化 */
  init(userId: string, user?: User) {
    const timbre = new Timbre()
    timbre.userId = userId
    timbre.user = user
    timbre.role = 9999
    timbre.robot = 0
    timbre.roleList = []
    timbre.robotList = []
    return this.timbresRepository.save(timbre)
  }

  async addRole(addRoleDto: AddRoleDto, userId: string) {
    const timbre = await this.timbresRepository.findOneBy({ userId })
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
    return this.timbresRepository.save(timbre)
  }

  async addRobot(addRobotDto: AddRobotDto, userId: string) {
    const timbre = await this.timbresRepository.findOneBy({ userId })
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
    return this.timbresRepository.save(timbre)
  }

  async findAll(userId: string, dirname: string) {
    let timbre = await this.timbresRepository.findOneBy({ userId })
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
  }

  async remove(type: 'role' | 'robot', key: number, userId: string, dirname: string) {
    const timbre = await this.timbresRepository.findOneBy({ userId })
    if (type === 'role') {
      const index = timbre.roleList.findIndex(role => role.key === key)
      if (index === -1) return false
      timbre.roleList.splice(index, 1)
      await this.timbresRepository.save(timbre)
      return true
    }
    if (type === 'robot') {
      const index = timbre.robotList.findIndex(role => role.key === key)
      console.log(index)
      if (index === -1) return false
      timbre.robotList.splice(index, 1)
      await this.timbresRepository.save(timbre)
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
