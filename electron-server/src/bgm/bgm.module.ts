import { Module } from '@nestjs/common'
import { BgmService } from './bgm.service'
import { BgmController } from './bgm.controller'
import { Bgm } from './entities/bgm.entity'
import { StorageModule } from 'src/storage/storage.module'

@Module({
  imports: [StorageModule],
  controllers: [BgmController],
  providers: [BgmService],
  exports: [BgmService]
})
export class BgmModule {}
