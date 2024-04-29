import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { databaseConfig, jwtConfig, commonConfig, sherpaDevConfig, sherpaProdConfig } from './config'
import { AuthModule } from './auth/auth.module'
import { BcryptModule } from './bcrypt/bcrypt.module'
import { BgmModule } from './bgm/bgm.module'
import { FfmpegModule } from './ffmpeg/ffmpeg.module'
import { FolderModule } from './folder/folder.module'
import { FragmentModule } from './fragment/fragment.module'
import { ProjectModule } from './project/project.module'
import { SherpaModule } from './sherpa/sherpa.module'
import { StorageModule } from './storage/storage.module'
import { TimbreModule } from './timbre/timbre.module'
import { TrashModule } from './trash/trash.module'
import { UploadModule } from './upload/upload.module'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserLoggerModule } from './user-logger/userLogger.module'
import { LoggerModule } from './logger/logger.module'
import saslprep from 'saslprep'
import { HttpLoggerMiddleware } from './logger/logger.middleware'

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        jwtConfig,
        // commonConfig,
        process.env.NODE_ENV === 'development' ? sherpaDevConfig : sherpaProdConfig
      ],
      cache: true,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // FIXME 警告：设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
        return {
          type: 'mongodb', // 数据库类型
          username: configService.get('database.username'), // 账号
          password: saslprep(configService.get('database.password')), // 密码
          host: configService.get('database.host'), // host
          port: configService.get('database.port'), //
          database: configService.get('database.database'), // 库名
          // entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
          synchronize: configService.get('database.synchronize'), // synchronize字段代表是否自动将实体类同步到数据库
          retryDelay: configService.get('database.retryDelay'), // 重试连接数据库间隔
          retryAttempts: configService.get('database.retryAttempts'), // 重试连接数据库的次数
          autoLoadEntities: configService.get('database.autoLoadEntities') // 如果为true,将自动加载实体 forFeature() 方法注册的每个实体都将自动添加到配置对象的实体数组中
        }
      }
    }),
    AuthModule,
    FolderModule,
    BcryptModule,
    StorageModule,
    FragmentModule,
    UploadModule,
    TrashModule,
    SherpaModule,
    ProjectModule,
    FfmpegModule,
    TimbreModule,
    BgmModule,
    UserLoggerModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(HttpLoggerMiddleware).forRoutes('*') // 为所有路由应用中间件
  // }
}
