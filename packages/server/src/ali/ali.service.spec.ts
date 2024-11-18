import { Test, TestingModule } from '@nestjs/testing';
import { AliService } from './ali.service';

describe('AliService', () => {
  let service: AliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AliService],
    }).compile();

    service = module.get<AliService>(AliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
