import { Test, TestingModule } from '@nestjs/testing';
import { AliController } from './ali.controller';
import { AliService } from './ali.service';

describe('AliController', () => {
  let controller: AliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliController],
      providers: [AliService],
    }).compile();

    controller = module.get<AliController>(AliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
