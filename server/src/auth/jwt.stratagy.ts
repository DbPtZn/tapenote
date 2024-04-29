import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { ConfigService } from '@nestjs/config'
import { AUTH_CONTEXT, AuthContext } from './request.context'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_CONTEXT) private readonly context: AuthContext
  ) {
    const secret = configService.get('jwt.secret')
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
    const authInfo = { _id: new ObjectId(payload.userId), account: payload.account, dirname: payload.dirname }
    this.context.set('authInfo', authInfo)
    return authInfo
  }
}
