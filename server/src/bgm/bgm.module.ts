import { Module } from '@nestjs/common'
import { BgmService } from './bgm.service'
import { BgmController } from './bgm.controller'
import { Bgm } from './entities/bgm.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StorageModule } from 'src/storage/storage.module'

@Module({
  imports: [TypeOrmModule.forFeature([Bgm]), StorageModule],
  controllers: [BgmController],
  providers: [BgmService],
  exports: [BgmService]
})
export class BgmModule {}
