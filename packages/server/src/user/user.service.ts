import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Dir, SubmissionConfig, SubscriptionConfig, User } from './entities/user.entity'
import { DataSource, Repository } from 'typeorm'
import { UpdateUserPwdDto } from './dto/update-pwd.dto'
import { basename } from 'path'
import { StorageService } from 'src/storage/storage.service'
import { UpdateUserConfigDto, UpdateUserSubmissionConfigDto, UpdateUserSubscriptionConfigDto } from './dto/_api'
import { uuidv7 } from 'uuidv7'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { LibraryEnum } from 'src/enum'
import { Folder } from 'src/folder/entities/folder.entity'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'
import bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }

  quertExistsByAccount(account: string) {
    return this.usersRepository.existsBy({ account })
  }

  /** 创建新用户 */
  async create(createUserDto: CreateUserDto) {
    try {
      // 获取注册信息
      const { account, password, nickname } = createUserDto
      this.logger.log(`正在为 ${account} 创建新用户...`)
      const isValid = /^[a-zA-Z0-9@.]+$/.test(account)
      if (!isValid) throw new Error('账号名称包含非法字符！')
      if (password.includes(' ')) throw new Error('密码中不能包含空格！')
      // 判断该用户是否存在
      const isUserExist = await this.usersRepository.existsBy({ account })
      if (isUserExist) {
        this.logger.error(`用户 ${account} 已注册！`)
        throw new Error('该账号已注册！')
      }
      const dirname = await this.generateDirname()
      // 密码哈希加盐
      const encryptedPassword = bcrypt.hashSync(password)
      const user = new User()
      // user.id = UUID.v4()
      user.account = account
      user.nickname = nickname ? nickname : `新用户-${randomstring.generate(5)}`
      user.encryptedPassword = encryptedPassword
      user.dirname = dirname

      const folders = [LibraryEnum.NOTE, LibraryEnum.COURSE, LibraryEnum.PROCEDURE].map(lib => {
        const folder = new Folder()
        folder.id = uuidv7()
        folder.name = `${lib.toLocaleUpperCase()} ROOT DIR`
        folder.desc = 'Root Folder'
        folder.lib = lib
        folder.parentId = null
        return folder
      })

      // 创建根目录
      user.dir = new Dir()
      user.dir = {
        note: folders.find(folder => folder.lib === LibraryEnum.NOTE).id,
        course: folders.find(folder => folder.lib === LibraryEnum.COURSE).id,
        procedure: folders.find(folder => folder.lib === LibraryEnum.PROCEDURE).id
      }

      // 其它配置
      user.submissionConfig = []
      user.subscriptionConfig = []
      user.config = {
        autosave: true, // 是否自动保存
        saveInterval: 15000 // 自动保存间隔毫秒
      }

      user.countor = {
        date: new Date(),
        noteCount: 0,
        procedureCount: 0,
        courseCount: 0,
        wordCount: 0,
        storageCount: 0
      }

      // 使用事务来确保所有操作要么全部成功，要么全部撤销
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        const newUser = await queryRunner.manager.save(user)
        for (const folder of folders) {
          folder.userId = newUser.id
          folder.user = newUser
          await queryRunner.manager.save(folder)
        }
        await queryRunner.commitTransaction()
        return newUser
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }
      // console.log(newUser)
      // this.timbreService.init(newUser.id) // 创建用户的音色列表
      // this.bgmService.init(newUser.id) // 创建 BGM 列表
      // this.logger.log(`创建新用户 ${newUser.account} 成功！`)
    } catch (error) {
      this.logger.error(`创建新用户失败，失败原因：${error.message} `)
      throw error
    }
  }

  /** 创建用户根目录 */
  // async createUserRoot(dir: { note: string; course: string; procedure: string }, userId: string) {
  //   try {
  //     const user = await this.usersRepository.findOneBy({ id: userId })
  //     const { note, course, procedure } = dir
  //     if (!user.dir || Object.keys(user.dir).length === 0 || user.dir?.note) user.dir = new Dir()
  //     if (!user.dir.note && note) user.dir.note = note
  //     if (!user.dir.course && course) user.dir.course = course
  //     if (!user.dir.procedure && procedure) user.dir.procedure = procedure
  //     // console.log(user)
  //     await this.usersRepository.save(user)
  //     return 'successful!'
  //   } catch (error) {
  //     throw error
  //   }
  // }

  /** 通过账号查询用户 */
  async findOneByAccount(account: string) {
    const user = await this.usersRepository.findOne({
      where: { account: account },
      select: ['id', 'account', 'dirname', 'encryptedPassword', 'dir']
    })
    return user || null
  }

  /** 通过 id 查询用户 */
  async findOneById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      return user
    } catch (error) {
      throw error
    }
  }

  /** 通过 id 查询用户目录信息 (弃用) */
  // async getDirById(id: string) {
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       where: { id }
  //     })
  //     if (user) {
  //       // this.userLogger.log(`查询到用户 ${user.account} 的目录信息`)
  //       return {
  //         dir: user.dir
  //       }
  //     } else throw new Error('查询用户目录信息失败！')
  //   } catch (error) {
  //     // this.userLogger.warn(`查询不到用户目录信息！原因：${error.message}`)
  //     throw error
  //   }
  // }

  /** 通过 id 查询用户基本信息 */
  async getInfoById(id: string, dirname: string) {
    try {
      this.userLogger.log(`正在查询用户信息...`)
      const user = await this.usersRepository.findOneBy({ id })
      this.userLogger.log(`查询用户信息成功!`)
      user.avatar = this.storageService.getResponsePath(user.avatar, dirname)
      // console.log(user)
      return {
        resourceDomain: this.common.enableCOS ? this.common.proxyDomain : '', // 代理文件地址
        account: user.account,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        homepage: user.homepage,
        desc: user.desc,
        dir: user.dir,
        config: user.config,
        submissionConfig: user.submissionConfig,
        subscriptionConfig: user.subscriptionConfig
      }
    } catch (error) {
      this.userLogger.warn(`查询用户信息失败！`)
      throw error
    }
  }

  /** 获取账号 */
  async getAccount(id: string) {
    const user = await this.findOneById(id)
    return user.account
  }
  
  async updateCountor(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['projects']
      })
      // console.log(user?.countor?.date instanceof Date)
      if (user?.countor?.date) {
        const now = new Date()
        const interval = now.getTime() - (new Date(user.countor.date)).getTime()
        // console.log(interval)
        if (interval < 86400000) {
          throw new Error('今天已经统计过啦！')
        }
      }
      
      const dirname = user.dirname
      // console.log(dirname)
      const storageCount = await this.storageService.calsculateSize(dirname)
      // console.log(storageCount)
      let noteCount = 0
      let procedureCount = 0
      let courseCount = 0
      let wordCount = 0

      user.projects.forEach(project => {
        wordCount += project.detail.wordage
        if (project.lib === LibraryEnum.NOTE) noteCount++
        if (project.lib === LibraryEnum.PROCEDURE) procedureCount++
        if (project.lib === LibraryEnum.COURSE) courseCount++
      })
      // console.log(noteCount)
      user.countor = {
        date: new Date(),
        noteCount,
        procedureCount,
        courseCount,
        wordCount,
        storageCount
      }
      // console.log(user.countor)
      await this.usersRepository.save(user)
      this.userLogger.log(`更新用户统计信息成功！时间为：${user.countor.date}`)
      return user.countor
    } catch (error) {
      // console.log(error)
      this.userLogger.error(`更新用户统计信息失败！`, error.message)
      throw error
    }
  }

  async updateInfo(updateUserDto: UpdateUserDto, id: string, dirname: string) {
    this.userLogger.log(`正在更新用户信息...`)
    const { avatar, nickname, desc, email, phone, homepage } = updateUserDto
    const user = await this.findOneById(id)
    if (user) {
      user.avatar = basename(avatar)
      user.nickname = nickname
      user.desc = desc
      user.email = email
      user.phone = phone
      user.homepage = homepage
      const newUser = await this.usersRepository.save(user)
      this.userLogger.log(`更新用户信息成功！`)
      return { updateAt: newUser.updateAt }
    } else {
      this.userLogger.log(`更新用户信息失败！`)
      throw new Error('用户不存在！')
    }
  }

  async updatePwd(updatePwdDto: UpdateUserPwdDto, id: string) {
    try {
      this.userLogger.log(`正在更新用户密码...`)
      const { newPwd, oldPwd } = updatePwdDto
      if(!oldPwd) throw new Error('旧密码不能为空！')
      const user = await this.findOneById(id)
      // 用户旧密码是否正确
      const valid = bcrypt.compareSync(oldPwd, user.encryptedPassword)
      if (!valid) throw new Error('旧密码错误，修改密码失败')
      // 新密码哈希加盐
      const encryptedPassword = bcrypt.hashSync(newPwd)
      if (user) {
        user.encryptedPassword = encryptedPassword
        const newUser = await this.usersRepository.save(user)
        this.userLogger.log(`更新用户密码成功！`)
        return { updateAt: newUser.updateAt }
      } else {
        throw new Error('用户不存在！')
      }
    } catch (error) {
      this.userLogger.error(`更新用户密码失败！原因：${error.message} `)
      throw error
    }
  }

  async updateConfig(updateConfigDto: UpdateUserConfigDto, id: string) {
    try {
      const { autosave, saveInterval, autoLoadCourse } = updateConfigDto
      const user = await this.usersRepository.findOneBy({ id })
      user.config = {
        autosave: autosave === false ? false : true,
        saveInterval: saveInterval < 5000 ? 5000 : saveInterval, // 自动保存最小间隔5秒
        autoLoadCourse: autoLoadCourse || false
      }
      await this.usersRepository.save(user)
      return 'Update user config successful'
    } catch (error) {
      throw error
    }
  }

  /** 添加投稿配置 */
  async addSubmissionConfig(id: string) {
    try {
      this.userLogger.log(`正在添加投稿配置...`)
      const user = await this.findOneById(id)
      // console.log(user)
      const config = new SubmissionConfig()
      config.id = randomstring.generate(8)
      config.name = ''
      config.site = ''
      config.code = ''
      config.desc = ''
      user.submissionConfig ? user.submissionConfig.push(config) : (user.submissionConfig = [config])
      const newUser = await this.usersRepository.save(user)
      if (newUser) {
        this.userLogger.log(`成功添加投稿配置：${JSON.stringify(config)}`)
        return { config: config, updateAt: newUser.updateAt }
      } else throw new Error('添加投稿配置失败！')
    } catch (error) {
      this.userLogger.error(`添加投稿配置失败！原因：${error.message} `)
      throw error
    }
  }
  /** 移除投稿配置 */
  async removeSubmissionConfig(configId: string, id: string) {
    try {
      this.userLogger.log(`正在移除${configId}投稿配置...`)
      const user = await this.findOneById(id)
      user.submissionConfig.some((config, index, arr) => {
        if (config.id === configId) {
          arr.splice(index, 1)
        }
      })
      const newUser = await this.usersRepository.save(user)
      if (newUser) {
        this.userLogger.log(`成功移除${configId}投稿配置！`)
        return { updateAt: newUser.updateAt }
      } else throw new Error('移除投稿配置失败！')
    } catch (error) {
      this.userLogger.error(`移除${configId}投稿配置失败！原因：${error.message} `)
      throw error
    }
  }

  async updateSubmissionConfig(dto: UpdateUserSubmissionConfigDto, userId: string) {
    try {
      this.userLogger.log(`正在更新${dto.id}投稿配置...`)
      const { id, name, site, code, desc } = dto
      const user = await this.findOneById(userId)
      user.submissionConfig.forEach((item, index, arr) => {
        if (item.id === id) {
          arr[index].name = name
          arr[index].site = site
          arr[index].code = code
          arr[index].desc = desc
        }
      })
      const newUser = await this.usersRepository.save(user)
      if (newUser) {
        this.userLogger.log(`成功更新${id}投稿配置！`)
        return { updateAt: newUser.updateAt }
      } else throw new Error('更新投稿配置失败！')
    } catch (error) {
      this.userLogger.error(`更新${dto.id}投稿配置失败！原因：${error.message} `)
      throw error
    }
  }

  /** 添加订阅配置 */
  async addSubscriptionConfig(id: string) {
    try {
      this.userLogger.log(`正在添加订阅配置...`)
      const user = await this.findOneById(id)
      const config = new SubscriptionConfig()
      config.id = randomstring.generate(8)
      config.name = ''
      config.site = ''
      config.code = ''
      config.desc = ''
      user.subscriptionConfig ? user.subscriptionConfig.push(config) : (user.subscriptionConfig = [config])
      const newUser = await this.usersRepository.save(user)
      if (newUser) {
        this.userLogger.log(`成功添加订阅配置：${JSON.stringify(config)}`)
        return { config: config, updateAt: newUser.updateAt }
      } else throw new Error('添加订阅配置失败！')
    } catch (error) {
      this.userLogger.error(`添加订阅配置失败！原因：${error.message} `)
      throw error
    }
  }
  /** 移除订阅配置 */
  async removeSubscriptionConfig(configId: string, id: string) {
    try {
      this.userLogger.log(`正在移除${configId}订阅配置...`)
      const user = await this.findOneById(id)
      user.subscriptionConfig.some((config, index, arr) => {
        if (config.id === configId) {
          arr.splice(index, 1)
        }
      })
      const newUser = await this.usersRepository.save(user)
      if (newUser) {
        this.userLogger.log(`成功移除${configId}订阅配置！`)
        return { updateAt: newUser.updateAt }
      } else throw new Error('移除订阅配置失败！')
    } catch (error) {
      this.userLogger.error(`移除${configId}订阅配置失败！原因：${error.message} `)
      throw error
    }
  }

  async updateSubscriptionConfig(dto: UpdateUserSubscriptionConfigDto, id: string) {
    try {
      this.userLogger.log(`正在更新${dto.id}订阅配置...`)
      const { id, name, site, code, desc } = dto
      const user = await this.findOneById(id)
      user.subscriptionConfig.forEach((item, index, arr) => {
        if (item.id === id) {
          arr[index].name = name
          arr[index].site = site
          arr[index].code = code
          arr[index].desc = desc
        }
      })
      const newUser = await this.usersRepository.save(user)
      if (newUser) {
        this.userLogger.log(`成功更新${id}订阅配置`)
        return { updateAt: newUser.updateAt }
      } else throw new Error('更新订阅配置失败！')
    } catch (error) {
      this.userLogger.error(`更新${dto.id}订阅配置失败！原因：${error.message} `)
      throw error
    }
  }

  /** 生成用户私有目录的地址 */
  async generateDirname() {
    let dirname = randomstring.generate(8)
    let users = await this.usersRepository.find({ where: { dirname } })
    // 校验该地址是否已经存在
    // let fullPath1 = path.join(__rootdirname, 'public', dirname)
    // let fullPath2 = path.join(__rootdirname, 'private', dirname)
    //  || fs.existsSync(fullPath1) || fs.existsSync(fullPath2)
    while (users.length > 0) {
      // console.log('该用户文件夹已存在，重新生成')
      dirname = randomstring.generate(8)
      users = await this.usersRepository.find({ where: { dirname } })
      // fullPath1 = path.join(__rootdirname, 'public', dirname)
      // fullPath2 = path.join(__rootdirname, 'private', dirname)
    }
    return dirname
  }
}

/** 生成随机字符串 */
// function generateRandomStr(num = 8) {
//   const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   let result = ''

//   for (let i = 0; i < num; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length)
//     result += characters.charAt(randomIndex)
//   }

//   return result
// }
