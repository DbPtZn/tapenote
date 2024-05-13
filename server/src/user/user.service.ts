import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Dir, SubmissionConfig, SubscriptionConfig, User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { BcryptService } from 'src/bcrypt/bcrypt.service'
import { UpdateUserPwdDto } from './dto/update-pwd.dto'
import fs from 'fs'
import path from 'path'
import { StorageService } from 'src/storage/storage.service'
import { UpdateUserSubmissionConfigDto, UpdateUserSubscriptionConfigDto } from './dto/_api'
import * as UUID from 'uuid'
import { TimbreService } from 'src/timbre/timbre.service'
import { BgmService } from 'src/bgm/bgm.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'

const __rootdirname = process.cwd()
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly storageService: StorageService,
    private readonly bcrtptService: BcryptService,
    private readonly timbreService: TimbreService,
    private readonly bgmService: BgmService,
    private readonly userLogger: UserLoggerService,
    private readonly logger: LoggerService
  ) {}

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
      const encryptedPassword = this.bcrtptService.hashSync(password)
      const user = new User()
      // user.id = UUID.v4()
      user.account = account
      user.nickname = nickname
      user.encryptedPassword = encryptedPassword
      user.dirname = dirname
      const newUser = await this.usersRepository.save(user)
      // console.log(newUser)
      this.timbreService.init(newUser.id) // 创建用户的音色列表
      this.bgmService.init(newUser.id) // 创建 BGM 列表
      this.logger.log(`创建新用户 ${newUser.account} 成功！`)
      return newUser
    } catch (error) {
      this.logger.error(`创建新用户失败，失败原因：${error.message} `)
      throw error
    }
  }

  /** 创建用户根目录 */
  async createUserRoot(dir: { note: string; course: string; procedure: string }, userId: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId })
      const { note, course, procedure } = dir
      if (!user.dir || Object.keys(user.dir).length === 0 || user.dir?.note) user.dir = new Dir()
      if (!user.dir.note && note) user.dir.note = note
      if (!user.dir.course && course) user.dir.course = course
      if (!user.dir.procedure && procedure) user.dir.procedure = procedure
      // console.log(user)
      await this.usersRepository.save(user)
      return 'successful!'
    } catch (error) {
      throw error
    }
  }

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

  /** 通过 id 查询用户目录信息 */
  async getDirById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id })
      if (user) {
        // this.userLogger.log(`查询到用户 ${user.account} 的目录信息`)
        return {
          dir: user.dir
        }
      } else throw new Error('查询用户目录信息失败！')
    } catch (error) {
      // this.userLogger.warn(`查询不到用户目录信息！原因：${error.message}`)
      throw error
    }
  }

  /** 通过 id 查询用户基本信息 */
  async getInfoById(id: string, dirname: string) {
    try {
      this.userLogger.log(`正在查询用户信息...`)
      const user = await this.usersRepository.findOneBy({ id })
      this.userLogger.log(`查询用户信息成功!`)
      // console.log(user)
      return {
        account: user.account,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar
          ? this.storageService.getFilePath({
              filename: user.avatar,
              dirname,
              category: 'image',
              prv: false
            })
          : '',
        phone: user.phone,
        homepage: user.homepage,
        desc: user.desc,
        dir: user.dir,
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

  async updateInfo(updateUserDto: UpdateUserDto, id: string) {
    this.userLogger.log(`正在更新用户信息...`)
    const { avatar, nickname, desc, email, phone, homepage } = updateUserDto
    const user = await this.findOneById(id)
    const filename = path.basename(avatar)
    if (user) {
      user.avatar = filename
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
      const user = await this.findOneById(id)
      // 用户旧密码是否正确
      const valid = this.bcrtptService.compareSync(oldPwd, user.encryptedPassword)
      if (!valid) throw new Error('旧密码错误，修改密码失败')
      // 新密码哈希加盐
      const encryptedPassword = this.bcrtptService.hashSync(newPwd)
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

  /** 添加投稿配置 */
  async addSubmissionConfig(id: string) {
    try {
      this.userLogger.log(`正在添加投稿配置...`)
      const user = await this.findOneById(id)
      const config = new SubmissionConfig()
      config.id = UUID.v4()
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

  async updateSubmissionConfig(dto: UpdateUserSubmissionConfigDto, id: string) {
    try {
      this.userLogger.log(`正在更新${dto.id}投稿配置...`)
      const { id, name, site, code, desc } = dto
      const user = await this.findOneById(id)
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
      config.id = UUID.v4()
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
    let dirname = generateRandomStr()
    let users = await this.usersRepository.find({ where: { dirname } })
    // 校验该地址是否已经存在
    let fullPath1 = path.join(__rootdirname, 'public', dirname)
    let fullPath2 = path.join(__rootdirname, 'private', dirname)
    while (users.length > 0 || fs.existsSync(fullPath1) || fs.existsSync(fullPath2)) {
      // console.log('该用户文件夹已存在，重新生成')
      dirname = generateRandomStr()
      users = await this.usersRepository.find({ where: { dirname } })
      fullPath1 = path.join(__rootdirname, 'public', dirname)
      fullPath2 = path.join(__rootdirname, 'private', dirname)
    }
    return dirname
  }
}

/** 生成随机字符串 */
function generateRandomStr(num = 8) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}
