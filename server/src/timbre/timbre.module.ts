import { Module } from '@nestjs/common'
import { TimbreService } from './timbre.service'
import { TimbreController } from './timbre.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Timbre } from './entities/timbre.entity'
import { StorageModule } from 'src/storage/storage.module'
import { SherpaModule } from 'src/sherpa/sherpa.module'

@Module({
  imports: [TypeOrmModule.forFeature([Timbre]), StorageModule, SherpaModule],
  controllers: [TimbreController],
  providers: [TimbreService],
  exports: [TimbreService]
})
export class TimbreModule {}
