import { Module, forwardRef } from '@nestjs/common'
import { FolderService } from './folder.service'
import { FolderController } from './folder.controller'
import { UserModule } from 'src/user/user.module'
import { Folder } from './entities/folder.entity'
import { AuthModule } from 'src/auth/auth.module'
import { ProjectModule } from 'src/project/project.module'

@Module({
  imports: [UserModule, ProjectModule], //, AuthModule
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService]
})
export class FolderModule {}
