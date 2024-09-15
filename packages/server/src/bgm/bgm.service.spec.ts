import { Test, TestingModule } from '@nestjs/testing';
import { BgmService } from './bgm.service';

describe('BgmService', () => {
  let service: BgmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BgmService],
    }).compile();

    service = module.get<BgmService>(BgmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
