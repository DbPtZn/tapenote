import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.stratagy'
import { LocalStrategy } from './local.strategy'
import { FolderModule } from 'src/folder/folder.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard'
import { RequestScopedModule } from 'src/request-scoped/request-scoped.module'
import { commonConfig } from 'src/config'
import { HttpModule } from '@nestjs/axios'
import { AuthMiddleware } from './auth.middleware'
@Module({
  imports: [
    UserModule,
    FolderModule,
    RequestScopedModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: ['jwt', 'local'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'electron') {
          return {
            secret: configService.get('jwt.secret') // 加密密钥
          }
        }
        console.log(configService.get('jwt.expiresIn'))
        return {
          secret: configService.get('jwt.secret'), // 加密密钥
          signOptions: { expiresIn: configService.get('jwt.expiresIn') } // 配置： 保存时间
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard]
})
export class AuthModule {
  constructor(
    private readonly configService: ConfigService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    // console.log('common.ssoDomain:', common.ssoDomain)
    // 开启 sso 单点登录的时候，会拦截 login | register 请求
    common.ssoEnable && consumer.apply(AuthMiddleware).forRoutes(
      { path: `/auth/login`, method: RequestMethod.POST },
      { path: `/auth/register`, method: RequestMethod.POST },
      { path: `/auth/refresh`, method: RequestMethod.GET },
      { path: `/auth/sendCode/:email`, method: RequestMethod.GET },
      // { path: `/auth/identify`, method: RequestMethod.GET },
    )
  }
}
