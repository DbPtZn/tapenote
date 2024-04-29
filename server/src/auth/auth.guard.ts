import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super()
    console.log('LocalAuthGuard')
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
