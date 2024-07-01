import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
import { StorageModule } from 'src/storage/storage.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadFile } from './entities/file.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
const __rootdirname = process.cwd()
@Module({
  imports: [
    TypeOrmModule.forFeature([UploadFile]),
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: join(__rootdirname, 'public', 'images'),
    //     filename: (_, file, cb) => {
    //       // console.log(file)
    //       // const filename = `${new Date().getTime()}${extname(file.originalname)}`
    //       cb(null, file.originalname)
    //     }
    //   })
    // }),
    MulterModule.registerAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const common = configService.get<ReturnType<typeof commonConfig>>('common')
        const dest = common.appDir ? `${common.appDir}/assets/temp/images` : join(__rootdirname, 'temp', 'images')
        return {
          storage: diskStorage({
            destination: dest,
            filename: (_, file, cb) => {
              // console.log(file)
              // const filename = `${new Date().getTime()}${extname(file.originalname)}`
               // 使用 file.originalname 的时候，如果上传多张图片，必须确保图片名称不一样，否则后面的图片会覆盖前面的
              cb(null, file.originalname)
            }
          })
        }
      }
    }),
    StorageModule
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
