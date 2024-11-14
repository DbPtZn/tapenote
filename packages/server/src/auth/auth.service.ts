import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as svgCaptcha from 'svg-captcha'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { CreateUserDto } from 'src/user/dto/_api'
import { FolderService } from 'src/folder/folder.service'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { LoggerService } from 'src/logger/logger.service'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'
import bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly logger: LoggerService
  ) {
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }
  /** 注册 */
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  // createUserRoot(id: string) {
  //   return this.folderService.createUserRoot(id)
  // }

  /** 登录：生成 token */
  async login(user: User) {
    console.log('login')
    try {
      if (!user) {
        this.logger.error('用户登录失败！邮箱或密码错误！')
        throw new UnauthorizedException('用户邮箱或密码错误！')
      }
      const token = this.jwtService.sign({ userId: user.id, account: user.account, dirname: user.dirname })
      this.logger.log(`${user.account} 用户登录成功！`)
      return token
    } catch (error) {
      this.logger.log(`${user.account} 用户登录失败！原因： ${error.message}`)
      return error
    }
  }

  /** sso 单点登录模式的认证鉴权 */
  async identify(token: string, ip: string) {
    return new Promise<string>(async (resolve, reject) => {
      await this.httpService.axiosRef.get(`${this.common.ssoDomain}/auth/identify/${ip}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }).then(async resp => {
        if(resp.status === 200) {
          // console.log(resp.data)
          const account = resp.data.account as string
          const isVip = resp.data.isVip as boolean
          const vipExpirationAt = resp.data.vipExpirationAt
          const storageUsage = resp.data.storageUsage
          const isTester = resp.data.isTester
          // console.log('account:', account)
          let user = await this.userService.findOneByAccount(account)
          // 用户不存在,说明是新用户第一次登录,创建新用户
          if(!user) {
            try {
              // console.log('新用户:', account)
              user = await this.userService.create({
                nickname: `新用户-${randomstring.generate(5)}`,
                account: account,
                password: randomstring.generate(12)
              })
              this.logger.log(`为 ${account} 创建新用户成功！`)
              this.httpService.axiosRef.patch(`${this.common.ssoDomain}/user/register/note`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).catch(err => {
                // note 注册状态只为记录用户使用情况，不影响用户实际使用，错误不做处理
                this.logger.error(`通知 sso 系统更新 ${account} 的 note 注册状态失败！`)
              })
            } catch (error) {
              this.logger.error(`为 ${account} 创建新用户失败, ${error.message}`)
              throw new Error('首次登录, 创建新用户失败!')
            }
          }
          // rfh：刷新时间
          const rfh = this.configService.get('jwt.refreshIn')
          const serverToken = this.jwtService.sign(
            { 
              userId: user.id, 
              isVip,
              vipExpirationAt,
              storageUsage,
              isTester,
              account: user.account, 
              dirname: user.dirname,
              rfh: (Math.floor(Date.now()/1000)) + rfh,
            })
          resolve(serverToken)
        }
      }).catch(err => {
        if(err.status === 401) {
          reject('sso-token 失效')
        } else {
          reject(err)
        }
      })
    })
  }

  /** 私有化部署时的刷新 token ：避免中断 */
  async refreshToken(id: string) {
    try {
      if (this.common.ssoEnable) {
        throw new Error('sso 模式下不允许使用 server refreshToken')
      }
      const user = await this.userService.findOneById(id)
      if (!user) throw new UnauthorizedException('用户不存在')
      const rfh = this.configService.get('jwt.refreshIn')
      // role 私有部署直接设置最高会员权限
      const token = this.jwtService.sign({ userId: user.id, isVip: true, account: user.account, dirname: user.dirname, rfh: (Math.floor(Date.now()/1000)) + rfh })
      return token
    } catch (err) {
      throw err
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
    // console.log(user)
    if (!user) return null
    // 用户密码是否正确
    const valid = bcrypt.compareSync(password, user.encryptedPassword)
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
