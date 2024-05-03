import { Test, TestingModule } from '@nestjs/testing';
import { UserLoggerService } from './userLogger.service';

describe('UserLoggerService', () => {
  let service: UserLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLoggerService],
    }).compile();

    service = module.get<UserLoggerService>(UserLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
