import { Module } from '@nestjs/common';
import { CvmService } from './cvm.service';
import { CvmController } from './cvm.controller';

@Module({
  controllers: [CvmController],
  providers: [CvmService],
})
export class CvmModule {}
