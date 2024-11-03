import { Controller } from '@nestjs/common';
import { CvmService } from './cvm.service';

@Controller('cvm')
export class CvmController {
  constructor(private readonly cvmService: CvmService) {}
}
