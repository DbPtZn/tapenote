import { Module } from '@nestjs/common'
import { XunfeiService } from './xunfei.service'
import { XunfeiController } from './xunfei.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [XunfeiController],
  providers: [XunfeiService]
})
export class XunfeiModule {}
