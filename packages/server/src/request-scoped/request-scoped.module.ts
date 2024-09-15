import { Module } from '@nestjs/common'
import { RequestScopedService } from './request-scoped.service'

@Module({
  imports: [],
  providers: [RequestScopedService],
  exports: [RequestScopedService]
})
export class RequestScopedModule {}
