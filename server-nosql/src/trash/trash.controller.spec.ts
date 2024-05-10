import { Test, TestingModule } from '@nestjs/testing';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

describe('TrashController', () => {
  let controller: TrashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrashController],
      providers: [TrashService],
    }).compile();

    controller = module.get<TrashController>(TrashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
