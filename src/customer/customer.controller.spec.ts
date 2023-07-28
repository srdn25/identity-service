import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { Logger } from '@nestjs/common';
import { ProviderService } from '../provider/provider.service';

describe('CustomerController', () => {
  let controller: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [Logger, ProviderService],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
