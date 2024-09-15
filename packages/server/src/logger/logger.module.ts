import { Global, Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { LoggerController } from './logger.controller'

@Global()
@Module({
  imports: [],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
