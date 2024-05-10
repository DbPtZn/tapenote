import { Test, TestingModule } from '@nestjs/testing';
import { TimbreController } from './timbre.controller';
import { TimbreService } from './timbre.service';

describe('TimbreController', () => {
  let controller: TimbreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimbreController],
      providers: [TimbreService],
    }).compile();

    controller = module.get<TimbreController>(TimbreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
