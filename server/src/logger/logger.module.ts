import { Global, Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { LoggerController } from './logger.controller'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
