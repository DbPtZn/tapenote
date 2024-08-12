import { Module, forwardRef } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { StorageModule } from 'src/storage/storage.module'
import { FfmpegModule } from 'src/ffmpeg/ffmpeg.module'
import { UserLoggerModule } from 'src/user-logger/userLogger.module'
import { FolderModule } from 'src/folder/folder.module'
import { FragmentModule } from 'src/fragment/fragment.module'
import { Fragment } from 'src/fragment/entities/fragment.entity'
import { SnapshotModule } from 'src/snapshot/snapshot.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => FolderModule),
    // forwardRef(() => FragmentModule),
    StorageModule,
    FfmpegModule,
    SnapshotModule,
    UserLoggerModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
