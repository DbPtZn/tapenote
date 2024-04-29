import { Global, Module } from '@nestjs/common'
import { UserLoggerService } from './userLogger.service'
import { StorageModule } from 'src/storage/storage.module'
import { AUTH_CONTEXT, AuthContext } from 'src/auth/request.context'

/** 该模块主要用于记录用户操作日志 日志会存放到本地的用户专属文件夹下 */
@Global()
@Module({
  imports: [StorageModule],
  providers: [
    UserLoggerService,
    {
      provide: AUTH_CONTEXT,
      useClass: AuthContext
    }
  ],
  exports: [UserLoggerService]
})
export class UserLoggerModule {}
