import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { Project } from './entities/project.entity'
import { StorageModule } from 'src/storage/storage.module'
import { FfmpegModule } from 'src/ffmpeg/ffmpeg.module'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'

@Module({
  imports: [StorageModule, FfmpegModule, UserLoggerModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}