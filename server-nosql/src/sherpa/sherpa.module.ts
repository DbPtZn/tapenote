import { Module } from '@nestjs/common'
import { SherpaService } from './sherpa.service'

@Module({
  providers: [SherpaService],
  exports: [SherpaService]
})
export class SherpaModule {}
