import { Injectable, UnauthorizedException } from '@nestjs/common'
import { BcryptService } from 'src/bcrypt/bcrypt.service'
import { UserService } from 'src/user/user.service'
// import * as svgCaptcha from 'svg-captcha'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
// import { ObjectId } from 'mongodb'
import { CreateUserDto } from 'src/user/dto/_api'
// import { FolderService } from 'src/folder/folder.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly bcrtptService: BcryptService,
    // private readonly folderService: FolderService,
    private readonly logger: LoggerService
  ) {}
  /** 注册 */
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  createUserRoot(_id: string) {
    // return this.folderService.createUserRoot(_id)
  }

  /** 登录：生成 token */
  async login(user: User) {
    try {
      if (!user) {
        this.logger.error('用户登录失败！邮箱或密码错误！')
        throw new UnauthorizedException('用户邮箱或密码错误！')
      }
      this.logger.log(`${user.account} 用户正在登录...`)
      // if (!user.dir) {
      //   this.logger.warn('该用户未创建根目录，正在为该用户创建根目录！')
      //   await this.folderService.createUserRoot(user._id)
      // }
      const token = this.jwtService.sign({ userId: user._id, account: user.account, dirname: user.dirname })
      this.logger.log(`${user.account} 用户登录成功！`)
      return token
    } catch (error) {
      this.logger.log(`${user.account} 用户登录失败！原因： ${error.message}`)
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
  // generateCode() {
  //   const Captcha = svgCaptcha.create({
  //     size: 4,
  //     fontSize: 34,
  //     width: 100,
  //     height: 34,
  //     background: '#cc9966',
  //     ignoreChars: ''
  //   })
  //   Captcha.text = this.bcrtptService.hashSync(Captcha.text.toLocaleLowerCase())
  //   return Captcha
  // }

  /** 比对验证码 */
  // validateCode(code: string, hashCode: string) {
  //   return this.bcrtptService.compareSync(code.toLocaleLowerCase(), hashCode)
  // }
}
