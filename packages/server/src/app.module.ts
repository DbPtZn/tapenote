import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import {
  databaseConfig,
  jwtConfig,
  commonConfig,
  sherpaDevConfig,
  sherpaProdConfig,
  xunfeiConfig,
  aliConfig,
  tencentConfig,
  cacheConfig,
  limitConfig
} from './config'
import { AuthModule } from './auth/auth.module'
import { BgmModule } from './bgm/bgm.module'
import { FfmpegModule } from './ffmpeg/ffmpeg.module'
import { FolderModule } from './folder/folder.module'
import { FragmentModule } from './fragment/fragment.module'
import { ProjectModule } from './project/project.module'
import { SherpaModule } from './sherpa/sherpa.module'
import { StorageModule } from './storage/storage.module'
import { TrashModule } from './trash/trash.module'
import { UploadModule } from './upload/upload.module'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserLoggerModule } from './user-logger/userLogger.module'
import { LoggerModule } from './logger/logger.module'
import { RequestScopedService } from './request-scoped/request-scoped.service'
import { RequestScopedModule } from './request-scoped/request-scoped.module'
import { SpeakerModule } from './speaker/speaker.module'
import { parentPort } from 'worker_threads'
import { SnapshotModule } from './snapshot/snapshot.module'
import { BucketModule } from './bucket/bucket.module'
import { CacheModule } from '@nestjs/cache-manager'
import { TencentModule } from './tencent/tencent.module'

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        jwtConfig,
        commonConfig,
        process.env.NODE_ENV === 'production' ? sherpaProdConfig : sherpaDevConfig,
        xunfeiConfig,
        aliConfig,
        tencentConfig,
        cacheConfig,
        limitConfig
      ],
      cache: true,
      isGlobal: true
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // https://docs.nestjs.cn/10/techniques?id=%e9%ab%98%e9%80%9f%e7%bc%93%e5%ad%98%ef%bc%88caching%ef%bc%89
        const cache = configService.get<ReturnType<typeof cacheConfig>>('cache')
        // console.log('cache:', cache)
        return {
          ttl: cache.ttl, // 设置默认的缓存过期时间（秒）
          max: cache.max, // 缓存中最大和最小数量
        }
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // FIXME 警告：设置 synchronize: true 不能被用于生产环境，否则您可能会丢失生产环境数据
        // const config = configService.get<ReturnType<typeof databaseConfig>>('database')
        let retryCount = 0
        console.log('NODE_ENV:', process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'electron') {
          // console.log('better-sqlite3')
          return {
            type: 'better-sqlite3', // 数据库类型
            database: configService.get('database.database'), // 'database.sqlite',
            synchronize: configService.get('database.synchronize'), // synchronize字段代表是否自动将实体类同步到数据库
            autoLoadEntities: true, // 如果为true,将自动加载实体 forFeature() 方法注册的每个实体都将自动添加到配置对象的实体数组中
            toRetry: err => {
              console.log('连接失败：', err.message)
              // 考虑把这个对 electron 的回复封装一下
              if (process.env.NODE_ENV === 'electron') {
                try {
                  parentPort.postMessage({ msg: `连接 better-sqlite3 数据库失败`, error: err.message })
                } catch (error) {
                  console.log('无法回复 electron 主进程:', error.message)
                }
              }
              retryCount++
              return retryCount < 2 // 定义数据库重连次数
            }
          }
        }

        if (['development', 'production'].includes(process.env.NODE_ENV)) {
          console.log('mysql')
          return {
            type: 'mysql', // 数据库类型
            username: configService.get('database.username'), // 账号
            password: configService.get('database.password'), // 密码
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
      }
    }),
    AuthModule,
    FolderModule,
    StorageModule,
    FragmentModule,
    UploadModule,
    TrashModule,
    SherpaModule,
    ProjectModule,
    FfmpegModule,
    BgmModule,
    UserLoggerModule,
    LoggerModule,
    RequestScopedModule,
    SpeakerModule,
    SnapshotModule,
    BucketModule,
    TencentModule
    // XunfeiModule,
    // AliModule
  ],
  controllers: [AppController],
  providers: [AppService, RequestScopedService]
})
export class AppModule {}
