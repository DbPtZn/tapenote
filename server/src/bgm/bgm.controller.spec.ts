import { Test, TestingModule } from '@nestjs/testing';
import { BgmController } from './bgm.controller';
import { BgmService } from './bgm.service';

describe('BgmController', () => {
  let controller: BgmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BgmController],
      providers: [BgmService],
    }).compile();

    controller = module.get<BgmController>(BgmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
