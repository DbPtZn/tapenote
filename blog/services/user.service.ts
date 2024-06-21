import type { ObjectId } from 'mongoose'
import type { CreateUserDto } from '~/dto'
import { User } from '~/models'
import type { UserType } from '~/types'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'
class UserService {
  usersRepository: typeof User
  constructor() {
    this.usersRepository = User
  }

  /** 创建新用户 */
  async create(createUserDto: CreateUserDto) {
    try {
      // 获取注册信息
      const { account, password, nickname } = createUserDto
      console.log(createUserDto)
      const isValid = /^[a-zA-Z0-9@.]+$/.test(account)
      if (!isValid) throw new Error('账号名称包含非法字符！')
      if (password.includes(' ')) throw new Error('密码不能包含空格！')
 
      // 判断该用户是否存在
      const isUserExist = await this.findOneByAccount(account)
      if (isUserExist) {
        throw new Error('该账号已注册！')
      }
      const UID = await this.generateUID()
      // 密码哈希加盐
      const salt = bcrypt.genSaltSync()
      const encryptedPassword = bcrypt.hashSync(password, salt)
      console.log(encryptedPassword)
      const user = await this.usersRepository.create({
        account,
        nickname,
        encryptedPassword,
        UID
      })
      console.log(user)
      return user
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /** 通过账号查询用户 */
  async findOneByAccount(account: string) {
    try {
      const user = await this.usersRepository.findOne({ account: account })
      return user || null
    } catch (error) {
      throw error
    }
  }

  async findOneById(id: ObjectId) {
    try {
      const user = await this.usersRepository.findById(id)
      return user
    } catch (error) {
      throw error
    }
  }

  /** 生成用户私有文件夹的地址 */
  async generateUID() {
    let UID = generateRandomStr()
    const __rootdirname = process.cwd()
    // 校验该地址是否已经存在
    let isExist = await this.usersRepository.exists({ UID })
    let fullPath = path.join(__rootdirname, 'public', UID)
    console.log(fullPath)
    console.log(isExist)
    while (fs.existsSync(fullPath) || isExist) {
      console.log('该用户文件夹已存在，重新生成')
      UID = generateRandomStr()
      isExist = await this.usersRepository.exists({ UID })
      fullPath = path.join(__rootdirname, 'public', UID)
    }
    console.log(UID)
    return UID
  }

  /** 用户密码登录验证 */
  async validateUser(account: string, password: string) {
    try {
      // 用户是否存在
      const user = await this.findOneByAccount(account)
      if (!user) return null
      // 用户密码是否正确
      const valid = bcrypt.compareSync(password, user.encryptedPassword)
      if (valid) return user
      return null
    } catch (error) {
      throw error
    }
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

export const userService = new UserService()
