import { Controller } from '@nestjs/common';
import { AliService } from './ali.service';

@Controller('ali')
export class AliController {
  constructor(private readonly aliService: AliService) {}
}
