import { Test, TestingModule } from '@nestjs/testing';
import { FragmentService } from './fragment.service';

describe('FragmentService', () => {
  let service: FragmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FragmentService],
    }).compile();

    service = module.get<FragmentService>(FragmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
