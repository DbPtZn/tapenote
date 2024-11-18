import { Controller } from '@nestjs/common';
import { XunfeiService } from './xunfei.service';

@Controller('xunfei')
export class XunfeiController {
  constructor(private readonly xunfeiService: XunfeiService) {}
}
