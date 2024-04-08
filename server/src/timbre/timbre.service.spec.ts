import { Test, TestingModule } from '@nestjs/testing';
import { TimbreService } from './timbre.service';

describe('TimbreService', () => {
  let service: TimbreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimbreService],
    }).compile();

    service = module.get<TimbreService>(TimbreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
