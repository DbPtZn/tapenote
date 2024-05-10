import { Module } from '@nestjs/common'
import { TimbreService } from './timbre.service'
import { TimbreController } from './timbre.controller'
import { Timbre } from './entities/timbre.entity'
import { StorageModule } from 'src/storage/storage.module'
import { SherpaModule } from 'src/sherpa/sherpa.module'

@Module({
  imports: [StorageModule, SherpaModule],
  controllers: [TimbreController],
  providers: [TimbreService],
  exports: [TimbreService]
})
export class TimbreModule {}
