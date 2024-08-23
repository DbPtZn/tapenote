import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { UserLoggerModule } from 'src/user-logger/userLogger.module';

@Module({
  imports: [],
  controllers: [BucketController],
  providers: [BucketService],
  exports: [BucketService]
})
export class BucketModule {}
