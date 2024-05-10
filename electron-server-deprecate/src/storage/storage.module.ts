import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'
const __rootdirname = process.cwd()
@Module({
  imports: [],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController]
})
export class StorageModule {}
