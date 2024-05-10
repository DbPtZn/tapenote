import { IStrategyOptions, Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

/** 本地策略 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'account',
      passwordField: 'password'
    } as IStrategyOptions)
  }

  async validate(account: string, password: string): Promise<any> {
    // console.log(account, password)
    const user = await this.authService.validateUser(account, password)
    if (!user) {
      throw new UnauthorizedException('用户名或密码不正确！')
    }
    return user
  }
}
