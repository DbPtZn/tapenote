import { Test, TestingModule } from '@nestjs/testing';
import { XunfeiController } from './xunfei.controller';
import { XunfeiService } from './xunfei.service';

describe('XunfeiController', () => {
  let controller: XunfeiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XunfeiController],
      providers: [XunfeiService],
    }).compile();

    controller = module.get<XunfeiController>(XunfeiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
