import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { StorageModule } from 'src/storage/storage.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadFile } from './entities/file.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import { BucketModule } from 'src/bucket/bucket.module'
import randomstring from 'randomstring'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile]),
    MulterModule.registerAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const common = configService.get<ReturnType<typeof commonConfig>>('common')
        return {
          storage: diskStorage({
            destination: common.fullTempDir,
            filename: (_, file, cb) => {
              // console.log(file)
              console.log('上传文件：')
              const filename = `${randomstring.generate(5)}-${new Date().getTime()}${extname(file.originalname)}`
              console.log('新文件名称：', filename)
              // 考虑到安全性，不使用 file.originalname
              cb(null, filename)
            }
          })
        }
      }
    }),
    StorageModule,
    BucketModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}
