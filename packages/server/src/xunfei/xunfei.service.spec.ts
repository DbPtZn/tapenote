import { Test, TestingModule } from '@nestjs/testing';
import { XunfeiService } from './xunfei.service';

describe('XunfeiService', () => {
  let service: XunfeiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XunfeiService],
    }).compile();

    service = module.get<XunfeiService>(XunfeiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
