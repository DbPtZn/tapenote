import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerService } from './speaker.service';

describe('SpeakerService', () => {
  let service: SpeakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakerService],
    }).compile();

    service = module.get<SpeakerService>(SpeakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
