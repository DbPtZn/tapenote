import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
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
    console.log('payload', payload)
    return { _id: new ObjectId(payload.userId), account: payload.account, dirname: payload.dirname }
  }
}
