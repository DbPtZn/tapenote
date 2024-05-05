import { Module } from '@nestjs/common'
import { FfmpegService } from './ffmpeg.service'
import { StorageModule } from 'src/storage/storage.module'

@Module({
  imports: [StorageModule],
  providers: [FfmpegService],
  exports: [FfmpegService]
})
export class FfmpegModule {}
