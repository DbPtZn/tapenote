import { ObjectId } from 'mongoose'
import type { CreateUserDto } from '~/dto'
import { User } from '~/models'
import { UserType } from '~/types'

class UserService {
  usersRepository: typeof User
  constructor() {
    this.usersRepository = User
  }

  /** 创建新用户 */
  async create(createUserDto: CreateUserDto) {
    // 获取注册信息
    const { account, password, nickname } = createUserDto
    // console.log(createUserDto)
    const isValid = /^[a-zA-Z0-9@.]+$/.test(account)
    if (!isValid) throw '账号名称包含非法字符！'
    if (password.includes(' ')) throw '密码中不能包含空格！'

    // 判断该用户是否存在
    const isUserExist = await this.findOneByAccount(account)
    if (isUserExist) {
      throw new Error('该账号已注册！')
    }

    const UID = generateUID()

    // 密码哈希加盐
    const encryptedPassword = this.bcrtptService.hashSync(password)

    const user = new UserType()
    user._id = new ObjectId()
    user.UID = UID
    user.account = account
    user.nickname = nickname
    user.encryptedPassword = encryptedPassword

    const newUser = await this.usersRepository.save(user)
    if (!newUser) throw '创建新用户失败！'
    return newUser
  }

  /** 通过账号查询用户 */
  async findOneByAccount(account: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { account: account } })
      return user || null
    } catch (error) {
      throw error
    }
  }

  async get(id: ObjectId) {
    try {
      const user = await this.usersRepository.findById(id)
      return user
    } catch (error) {
      throw error
    }
  }
}

export const userService = new UserService()
