import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Logger } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService, Logger],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
