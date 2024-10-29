import { Test, TestingModule } from '@nestjs/testing';
import { Listen2itService } from './workspace.service';

describe('Listen2itService', () => {
  let service: Listen2itService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Listen2itService],
    }).compile();

    service = module.get<Listen2itService>(Listen2itService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
