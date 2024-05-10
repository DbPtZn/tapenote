import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
const __rootdirname = process.cwd()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__rootdirname, 'assets', 'images'),
        filename: (_, file, cb) => {
          // console.log(file)
          // const filename = `${new Date().getTime()}${extname(file.originalname)}`
          cb(null, file.originalname)
        }
      })
    })
  ],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController]
})
export class StorageModule {}
