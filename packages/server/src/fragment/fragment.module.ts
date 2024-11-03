import { Module, forwardRef } from '@nestjs/common'
import { FragmentService } from './fragment.service'
import { FragmentController } from './fragment.controller'
import { StorageModule } from 'src/storage/storage.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join, extname } from 'path'
import { SherpaModule } from 'src/sherpa/sherpa.module'
import { ProjectModule } from 'src/project/project.module'
import { FfmpegModule } from 'src/ffmpeg/ffmpeg.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Fragment } from './entities/fragment.entity'
import { SpeakerModule } from 'src/speaker/speaker.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { commonConfig } from 'src/config'
import randomstring from 'randomstring'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'
import { UploadModule } from 'src/upload/upload.module'
const __rootdirname = process.cwd()
@Module({
  imports: [
    TypeOrmModule.forFeature([Fragment]),
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: join(__dirname, '/temp'),
    //     filename: (req, file, cb) => {
    //       let filename = ''
    //       const extension = extname(file.originalname)
    //       if (extension) {
    //         filename = `${Date.now()}${extension}`
    //       } else {
    //         filename = `${Date.now()}.${file.mimetype.split('/')[file.mimetype.split('/').length - 1]}`
    //       }
    //       cb(null, filename)
    //     }
    //   })
    // }),
    MulterModule.registerAsync({
      imports: [ConfigModule], // 导入 ConfigModule，以便在 TypeOrmModule 中使用 ConfigService
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        console.log('multer')
        const common = configService.get<ReturnType<typeof commonConfig>>('common')
        // const dest = common.appDir ? `${common.appDir}/assets/temp/images` : join(__rootdirname, 'temp', 'audios')
        return {
          storage: diskStorage({
            destination: common.fullTempDir,
            filename: (req, file, cb) => {
              let filename = ''
              const extension = extname(file.originalname)
              if (extension) {
                filename = `${randomstring.generate(5)}-${new Date().getTime()}${extension}`
              } else {
                filename = `${randomstring.generate(5)}-${new Date().getTime()}.${file.mimetype.split('/')[file.mimetype.split('/').length - 1]}`
              }
              cb(null, filename)
            }
          })
        }
      }
    }),
    // forwardRef(() => ProjectModule),
    ProjectModule,
    SpeakerModule,
    FfmpegModule,
    StorageModule,
    SherpaModule,
    UploadModule,
  ],
  controllers: [FragmentController],
  providers: [FragmentService],
  exports: [FragmentService]
})
export class FragmentModule {}
