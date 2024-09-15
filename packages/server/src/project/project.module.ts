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
import { User } from 'src/user/entities/user.entity'
import { UploadFile } from 'src/upload/entities/file.entity'
import { UploadModule } from 'src/upload/upload.module'
import { BucketModule } from 'src/bucket/bucket.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User]),
    forwardRef(() => FolderModule),
    // forwardRef(() => FragmentModule),
    StorageModule,
    FfmpegModule,
    SnapshotModule,
    BucketModule,
    UploadModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
