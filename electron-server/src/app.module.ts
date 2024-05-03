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
import { PouchDbService } from './pouch-db/pouch-db.service';
import { PouchDbModule } from './pouch-db/pouch-db.module';

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
    UserLoggerModule,
    LoggerModule,
    RequestScopedModule,
    PouchDbModule
  ],
  controllers: [AppController],
  providers: [AppService, PouchDbService]
})
export class AppModule {}
