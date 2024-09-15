import { Controller } from '@nestjs/common';
import { BucketService } from './bucket.service';

@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}
}
