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
  Put,
  Param,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { ValidationPipe } from '../pipes/Validation.pipe';
import { AuthCustomerGuard } from '../auth/authCustomer.guard';
import { SignInDto } from './dto/signIn.dto';
import { AuthStaticTokenGuard } from '../auth/authStaticToken.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';
import { UpdateUserDto } from '../user/dto/updateUser.dto';
import { User } from '../user/user.entity';

@ApiTags(swaggerMessages.tags.customer.tag)
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

  @UseGuards(AuthStaticTokenGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.user.update.name,
    parameters: [
      {
        name: 'idOrEmail',
        in: 'path',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.user.update.description,
  })
  @Put('/update/user/:id')
  async updateUser(
    @Response() response,
    @Request() request,
    @Body() body: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<User> {
    const result = await this.customerService.updateUser(
      body,
      request.customer.id,
      id,
    );

    return response.status(HttpStatus.OK).json(result);
  }
}
