import { Test, TestingModule } from '@nestjs/testing';
import { FfmpegService } from './ffmpeg.service';

describe('FfmpegService', () => {
  let service: FfmpegService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FfmpegService],
    }).compile();

    service = module.get<FfmpegService>(FfmpegService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
