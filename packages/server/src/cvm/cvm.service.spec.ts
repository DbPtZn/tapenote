import { Test, TestingModule } from '@nestjs/testing';
import { CvmService } from './cvm.service';

describe('CvmService', () => {
  let service: CvmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvmService],
    }).compile();

    service = module.get<CvmService>(CvmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
