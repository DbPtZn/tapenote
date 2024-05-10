import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig, databaseConfig, jwtConfig, sherpaDevConfig, sherpaProdConfig } from './config'
import { UserLoggerModule } from './user-logger/userLogger.module'
import { LoggerModule } from './logger/logger.module'
import { RequestScopedModule } from './request-scoped/request-scoped.module'
import { AuthModule } from './auth/auth.module'
import { PouchDBService } from './pouchdb/pouchdb.service'
import { PouchDbModule } from './pouchdb/pouchdb.module'
import { BcryptModule } from './bcrypt/bcrypt.module'
import { StorageModule } from './storage/storage.module'
import { TimbreModule } from './timbre/timbre.module'
import { BgmModule } from './bgm/bgm.module'
import { SherpaModule } from './sherpa/sherpa.module'
import { FragmentModule } from './fragment/fragment.module'
import { UploadModule } from './upload/upload.module'
import { FolderModule } from './folder/folder.module'
import { ProjectModule } from './project/project.module'
import { FfmpegModule } from './ffmpeg/ffmpeg.module'
import { TrashModule } from './trash/trash.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        // databaseConfig,
        jwtConfig,
        commonConfig,
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
    PouchDbModule,
    FragmentModule,
    UploadModule,
    TrashModule,
    SherpaModule,
    FolderModule,
    ProjectModule,
    FfmpegModule,
    TimbreModule,
    BgmModule
  ],
  controllers: [AppController],
  providers: [AppService, PouchDBService]
})
export class AppModule {}
