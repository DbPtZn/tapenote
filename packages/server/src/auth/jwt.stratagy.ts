import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RequestScopedService } from 'src/request-scoped/request-scoped.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly requestScopedService: RequestScopedService
  ) {
    const secret = configService.get('jwt.secret') || 'secret'
    // console.log('secret', secret)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret
    })
  }

  // 2. 系统自动验证token合法性，并将由token编译出的json作为参数传入validate方法中。
  async validate(payload: any) {
    // console.log('payload', payload)
    const authInfo = { id: payload.userId, role: payload.role, account: payload.account, dirname: payload.dirname }
    this.requestScopedService.setData(authInfo) //TODO 正在考虑为每个请求事务创建一个唯一标识，这样可以确定同一请求内产生的日志
    return authInfo
  }
}
