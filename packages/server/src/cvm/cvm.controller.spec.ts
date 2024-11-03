import { Test, TestingModule } from '@nestjs/testing';
import { CvmController } from './cvm.controller';
import { CvmService } from './cvm.service';

describe('CvmController', () => {
  let controller: CvmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvmController],
      providers: [CvmService],
    }).compile();

    controller = module.get<CvmController>(CvmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
