import { Module } from '@nestjs/common'
import { AliService } from './ali.service'
import { AliController } from './ali.controller'

@Module({
  controllers: [AliController],
  providers: [AliService],
  exports: [AliService]
})
export class AliModule {}
