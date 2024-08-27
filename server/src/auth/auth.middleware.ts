import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request, Response, NextFunction } from 'express'
import { commonConfig } from 'src/config'
import { UserService } from 'src/user/user.service'
import proxy from 'express-http-proxy'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly common: ReturnType<typeof commonConfig>
  constructor(
    // private readonly userService: UserService,
    private readonly configService: ConfigService,
    // private readonly jwtService: JwtService
  ) {
    // console.log('AuthMiddleware')
    this.common = this.configService.get<ReturnType<typeof commonConfig>>('common')
  }
  use(req: Request, res: Response, next: NextFunction) {
    // TODO 无法拦截修改响应结果，改为手动发送请求
    // if (req.originalUrl === '/auth/identify') {
    //   console.log('ProxyMiddleware')
    //   proxy(this.common.ssoDomain, {
    //     userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    //       return new Promise(async (resolve) => {
    //         const data = JSON.parse(proxyResData.toString('utf8'))
    //         console.log('data:', data)
    //         const account = data.account
    //         const user = await this.userService.findOneByAccount(account)
    //         // rfh：刷新时间
    //         const rfh = this.configService.get('jwt.refreshIn')
    //         const serverToken = this.jwtService.sign({
    //           userId: user.id,
    //           account: user.account,
    //           dirname: user.dirname,
    //           rfh: Math.floor(Date.now() / 1000) + rfh
    //         })
    //         return res.send({ type: 'server', token: serverToken })
    //         // userRes.send({ type: 'server', token: serverToken })
    //       })
    //     }
    //   })(req, res, next)
    // }
    return proxy(this.common.ssoDomain)(req, res, next)
  }
}
