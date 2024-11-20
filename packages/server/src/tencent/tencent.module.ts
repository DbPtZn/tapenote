import { Module } from '@nestjs/common'
import { TencentService } from './tencent.service'
import { TencentController } from './tencent.controller'

@Module({
  controllers: [TencentController],
  providers: [TencentService],
  exports: [TencentService]
})
export class TencentModule {}
