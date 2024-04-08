import { Injectable, UnauthorizedException } from '@nestjs/common'
import { BcryptService } from 'src/bcrypt/bcrypt.service'
import { UserService } from 'src/user/user.service'
import * as svgCaptcha from 'svg-captcha'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { ObjectId } from 'mongodb'
import { CreateUserDto } from 'src/user/dto/_api'
import { FolderService } from 'src/folder/folder.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcrtptService: BcryptService,
    private readonly folderService: FolderService
  ) {}
  /** 注册 */
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  createUserRoot(_id: ObjectId) {
    // console.log('auth')
    return this.folderService.createUserRoot(_id)
  }

  /** 登录：生成 token */
  async login(user: User) {
    try {
      if (!user) {
        throw new UnauthorizedException('用户邮箱或密码错误！')
      }
      if (!user.dir) {
        console.log('目录检查')
        await this.folderService.createUserRoot(user._id)
      }
      const token = this.jwtService.sign({ userId: user._id, account: user.account, dirname: user.dirname })
      return token
    } catch (error) {
      console.log(error)
      return error
    }
  }

  // // 登出: 一般登出在前端移除 token 就可以，不过如果我们要在服务端记录当前用户的登录状态，就需要登出
  // async logout() {
  //   return {
  //     message: 'ok'
  //   }
  // }

  /** 用户密码登录验证 */
  async validateUser(account: string, password: string) {
    // 用户是否存在
    const user = await this.userService.findOneByAccount(account)
    if (!user) return null
    // 用户密码是否正确
    const valid = this.bcrtptService.compareSync(password, user.encryptedPassword)
    if (valid) return user
    return null
  }

  /** 生成登录真人检测的验证码 */
  generateCode() {
    const Captcha = svgCaptcha.create({
      size: 4,
      fontSize: 34,
      width: 100,
      height: 34,
      background: '#cc9966',
      ignoreChars: ''
    })
    // Captcha.text = this.bcrtptService.hashSync(Captcha.text.toLocaleLowerCase()) // 开发环境不开启验证码加密
    return Captcha
  }

  /** 比对验证码 */
  validateCode(code: string, hashCode: string) {
    // return this.bcrtptService.compareSync(code.toLocaleLowerCase(), hashCode)
    return code === hashCode // 开发环境不开启验证码加密
  }
}
