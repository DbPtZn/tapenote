import { MiddlewareConsumer, Module, RequestMethod, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { StorageModule } from 'src/storage/storage.module'
import { BgmModule } from 'src/bgm/bgm.module'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'
import { ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { UserMiddleware } from './user.middleware'

@Module({
  imports: [TypeOrmModule.forFeature([User]), StorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
  
  constructor(
    private readonly configService: ConfigService
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const common = this.configService.get<ReturnType<typeof commonConfig>>('common')
    // console.log('common.ssoDomain:', common.ssoDomain)
    // 开启 sso 单点登录的时候，会拦截 login | register 请求
    common.ssoEnable && consumer.apply(UserMiddleware).forRoutes(
      // { path: `/user/register/:type`, method: RequestMethod.PATCH },
      { path: `/user/pwd`, method: RequestMethod.PATCH },
    )
  }
}
