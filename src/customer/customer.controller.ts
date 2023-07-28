import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Response,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private logger: Logger,
    private customerService: CustomerService,
  ) {}

  @Post()
  async create(@Response() response, @Body() body: CreateCustomerDto) {
    const result = await this.customerService.create(body);
    return response.status(HttpStatus.CREATED).json(result);
  }
}
