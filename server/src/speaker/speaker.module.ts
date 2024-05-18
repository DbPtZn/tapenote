import { Module } from '@nestjs/common'
import { SpeakerService } from './speaker.service'
import { SpeakerController } from './speaker.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Speaker } from './entities/speaker.entity'
import { UserModule } from 'src/user/user.module'
import { StorageModule } from 'src/storage/storage.module'

@Module({
  imports: [TypeOrmModule.forFeature([Speaker]), UserModule, StorageModule],
  controllers: [SpeakerController],
  providers: [SpeakerService],
  exports: [SpeakerService]
})
export class SpeakerModule {}
