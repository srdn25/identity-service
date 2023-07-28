import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private customerRepository: typeof Customer,
  ) {}

  async create(body): Promise<Customer> {
    const customer = await this.customerRepository.create(body);
    return customer;
  }
}
