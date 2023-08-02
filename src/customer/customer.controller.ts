import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Response,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { ValidationPipe } from '../pipes/Validation.pipe';
import { AuthCustomerGuard } from '../auth/authCustomer.guard';
import { SignInDto } from './dto/signIn.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private logger: Logger,
    private customerService: CustomerService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(@Response() response, @Body() body: CreateCustomerDto) {
    const result = await this.customerService.create(body);

    return response.status(HttpStatus.CREATED).json(result);
  }

  @UseGuards(AuthCustomerGuard)
  @UsePipes(ValidationPipe)
  @Get('update-token')
  async refreshToken(@Response() response, @Request() request) {
    const result = await this.customerService.refreshStaticToken(
      request.customer?.customerId,
    );

    return response.status(HttpStatus.OK).json(result);
  }

  @UsePipes(ValidationPipe)
  @Post('sign-in')
  async signIn(@Response() response, @Body() body: SignInDto) {
    const result = await this.customerService.signIn(body.login, body.password);

    return response.status(HttpStatus.OK).json(result);
  }
}
