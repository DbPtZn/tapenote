import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { databaseConfig, jwtConfig, sherpaDevConfig, sherpaProdConfig } from './config'
import { UserLoggerModule } from './user-logger/userLogger.module'
import { LoggerModule } from './logger/logger.module'
import { RequestScopedModule } from './request-scoped/request-scoped.module'
import { AuthModule } from './auth/auth.module'
import { PouchDBService } from './pouchdb/pouchdb.service'
import { PouchDbModule } from './pouchdb/pouchdb.module'
import { BcryptModule } from './bcrypt/bcrypt.module'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        // databaseConfig,
        jwtConfig,
        // commonConfig,
        process.env.NODE_ENV === 'development' ? sherpaDevConfig : sherpaProdConfig
      ],
      cache: true,
      isGlobal: true
    }),
    UserModule,
    AuthModule,
    BcryptModule,
    StorageModule,
    UserLoggerModule,
    LoggerModule,
    RequestScopedModule,
    PouchDbModule
  ],
  controllers: [AppController],
  providers: [AppService, PouchDBService]
})
export class AppModule {}