import { Test, TestingModule } from '@nestjs/testing';
import { FragmentController } from './fragment.controller';
import { FragmentService } from './fragment.service';

describe('FragmentController', () => {
  let controller: FragmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FragmentController],
      providers: [FragmentService],
    }).compile();

    controller = module.get<FragmentController>(FragmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
