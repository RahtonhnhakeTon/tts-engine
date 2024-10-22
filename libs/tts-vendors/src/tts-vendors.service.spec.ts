import { Test, TestingModule } from '@nestjs/testing';
import { TtsVendorsService } from './tts-vendors.service';

describe('TtsVendorsService', () => {
  let service: TtsVendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtsVendorsService],
    }).compile();

    service = module.get<TtsVendorsService>(TtsVendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
