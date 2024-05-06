import { Module } from '@nestjs/common'
import { TrashService } from './trash.service'
import { TrashController } from './trash.controller'
import { FolderModule } from 'src/folder/folder.module'
import { StorageModule } from 'src/storage/storage.module'
import { ProjectModule } from 'src/project/project.module'

@Module({
  imports: [StorageModule, FolderModule, ProjectModule],
  controllers: [TrashController],
  providers: [TrashService]
})
export class TrashModule {}
