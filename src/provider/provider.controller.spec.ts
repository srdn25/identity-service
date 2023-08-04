import { Test, TestingModule } from '@nestjs/testing';
import { ProviderController } from './provider.controller';
import { Logger } from '@nestjs/common';
import { ProviderService } from './provider.service';

describe('ProvidersController', () => {
  let controller: ProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderController],
      providers: [Logger, ProviderService],
    }).compile();

    controller = module.get<ProviderController>(ProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
