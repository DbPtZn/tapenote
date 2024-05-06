import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
// import { User } from './entities/user.entity'
import { BcryptModule } from 'src/bcrypt/bcrypt.module'
import { StorageModule } from 'src/storage/storage.module'
// import { TimbreModule } from 'src/timbre/timbre.module'
// import { BgmModule } from 'src/bgm/bgm.module'
// import { UserLoggerService } from 'src/user-logger/userLogger.service'
// import { UserLoggerModule } from 'src/user-logger/userLogger.module'
// import { PouchDBService } from 'src/pouchdb/pouchdb.service'
import { PouchDbModule } from 'src/pouchdb/pouchdb.module'
// import { LoggerModule } from 'src/logger/logger.module'
import { TimbreModule } from 'src/timbre/timbre.module'
import { BgmModule } from 'src/bgm/bgm.module'

@Module({
  imports: [PouchDbModule, StorageModule, BcryptModule, TimbreModule, BgmModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
