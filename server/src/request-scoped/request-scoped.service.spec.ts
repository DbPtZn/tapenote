import { Test, TestingModule } from '@nestjs/testing';
import { RequestScopedService } from './request-scoped.service';

describe('RequestScopedService', () => {
  let service: RequestScopedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestScopedService],
    }).compile();

    service = module.get<RequestScopedService>(RequestScopedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
