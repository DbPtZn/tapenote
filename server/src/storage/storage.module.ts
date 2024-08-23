import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadFile } from 'src/upload/entities/file.entity'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'
import { BucketModule } from 'src/bucket/bucket.module'
import { ConfigModule } from '@nestjs/config'
// import { MulterModule } from '@nestjs/platform-express'
// import { diskStorage } from 'multer'
// import { join } from 'path'
// const __rootdirname = process.cwd()
@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile]),
    BucketModule
  ],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController]
})
export class StorageModule {}
