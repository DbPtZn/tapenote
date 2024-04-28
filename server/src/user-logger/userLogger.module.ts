import { Global, Module } from '@nestjs/common'
import { UserLoggerService } from './userLogger.service'
import { StorageModule } from 'src/storage/storage.module'

/** 该模块主要用于记录用户操作日志 日志会存放到本地的用户专属文件夹下 */
@Global()
@Module({
  imports: [StorageModule],
  providers: [UserLoggerService],
  exports: [UserLoggerService]
})
export class UserLoggerModule {}
