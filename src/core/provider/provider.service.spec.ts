import { Test, TestingModule } from '@nestjs/testing';
import { ProviderService } from './provider.service';
import { Logger } from '@nestjs/common';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderService, Logger],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
