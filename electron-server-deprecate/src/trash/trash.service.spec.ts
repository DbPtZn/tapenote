import { Test, TestingModule } from '@nestjs/testing';
import { TrashService } from './trash.service';

describe('TrashService', () => {
  let service: TrashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrashService],
    }).compile();

    service = module.get<TrashService>(TrashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
