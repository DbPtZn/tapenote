import { Test, TestingModule } from '@nestjs/testing';
import { SpeakerController } from './speaker.controller';
import { SpeakerService } from './speaker.service';

describe('SpeakerController', () => {
  let controller: SpeakerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakerController],
      providers: [SpeakerService],
    }).compile();

    controller = module.get<SpeakerController>(SpeakerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
