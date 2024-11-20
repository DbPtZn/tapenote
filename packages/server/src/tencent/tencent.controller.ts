import { Controller } from '@nestjs/common';
import { TencentService } from './tencent.service';

@Controller('tencent')
export class TencentController {
  constructor(private readonly tencentService: TencentService) {}
}
