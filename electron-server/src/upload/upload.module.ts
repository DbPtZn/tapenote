import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
import { StorageModule } from 'src/storage/storage.module'
const __rootdirname = process.cwd()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__rootdirname, 'public', 'images'),
        filename: (_, file, cb) => {
          // console.log(file)
          // const filename = `${new Date().getTime()}${extname(file.originalname)}`
          cb(null, file.originalname)
        }
      })
    }),
    StorageModule
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}
