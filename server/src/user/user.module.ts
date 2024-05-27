import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { BcryptModule } from 'src/bcrypt/bcrypt.module'
import { StorageModule } from 'src/storage/storage.module'
import { BgmModule } from 'src/bgm/bgm.module'
import { UserLoggerService } from 'src/user-logger/userLogger.service'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), BcryptModule, StorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
  constructor(private readonly userService: UserService) {}

  /** 测试代码 */
  onModuleInit() {
    // this.userService.create({ nickname: 'test', account: '2618asfasdfs@rrr.com', password: 'password' })
  }
}
