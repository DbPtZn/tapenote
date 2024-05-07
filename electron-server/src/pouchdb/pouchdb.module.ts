import { Global, Module } from '@nestjs/common'
import { PouchDBService } from './pouchdb.service'
import { FolderModule } from 'src/folder/folder.module'
import { ProjectModule } from 'src/project/project.module'
import { UserModule } from 'src/user/user.module'
import { TimbreModule } from 'src/timbre/timbre.module'
import { BgmModule } from 'src/bgm/bgm.module'
import { UploadModule } from 'src/upload/upload.module'

// @Global()
@Module({
  imports: [UserModule, TimbreModule, BgmModule, FolderModule, ProjectModule, UploadModule],
  providers: [PouchDBService],
  exports: [PouchDBService]
})
export class PouchDbModule {}
