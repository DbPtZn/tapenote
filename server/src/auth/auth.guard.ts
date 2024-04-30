import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // canActivate(context: ExecutionContext) {
  //   // 在这里添加您自定义的认证逻辑
  //   console.log('LocalAuthGuard')
  //   // 例如，调用 super.logIn(request) 来建立一个 session
  //   return super.canActivate(context)
  // }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
