import { Test, TestingModule } from '@nestjs/testing';
import { SherpaService } from './sherpa.service';

describe('SherpaService', () => {
  let service: SherpaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SherpaService],
    }).compile();

    service = module.get<SherpaService>(SherpaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
