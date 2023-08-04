import {
  Controller,
  Logger,
  Get,
  Request,
  Param,
  Delete,
  Response,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Put,
  Body,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../consts';
import { User } from './user.entity';
import { AuthCustomerGuard } from '../auth/authCustomer.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags(swaggerMessages.tags.user.tag)
@Controller('users')
export class UserController {
  constructor(
    private logger: Logger,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: swaggerMessages.requests.user.getAll.name })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [User],
    description: swaggerMessages.requests.user.getAll.description,
  })
  @Get()
  async getAll(@Response() response): Promise<User[]> {
    this.logger.debug('debug getAll in user controller');
    const result = await this.userService.findAll();
    return response.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthCustomerGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.user.get.name,
    parameters: [
      {
        name: 'idOrEmail',
        in: 'path',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: swaggerMessages.requests.user.get.description,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: messages.USER_NOT_FOUND,
  })
  @Get('/:idOrEmail')
  async getUser(
    @Request() request,
    @Response() response,
    @Param('idOrEmail') idOrEmail: number | string,
  ) {
    const user = await this.userService.find(idOrEmail);

    if (!user) {
      throw new HttpException(messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (
      request.customer?.customerId &&
      !user.customers.some(
        (customer) => customer.id === request.customer.customerId,
      )
    ) {
      throw new UnauthorizedException();
    }

    return response.status(HttpStatus.OK).json(user);
  }

  @UseGuards(AuthCustomerGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.user.delete.name,
    parameters: [
      {
        name: 'idOrEmail',
        in: 'path',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.user.delete.description,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: messages.USER_NOT_FOUND,
  })
  @Delete('/:idOrEmail')
  async deleteUser(
    @Request() request,
    @Response() response,
    @Param('idOrEmail') idOrEmail: number | string,
  ) {
    const user = await this.userService.find(idOrEmail);

    if (
      request.customer?.customerId &&
      !user.customers.some(
        (customer) => customer.id === request.customer.customerId,
      )
    ) {
      throw new UnauthorizedException();
    }

    const result = await this.userService.delete(idOrEmail);

    return response.status(HttpStatus.OK).json(result);
  }

  @Put('/:id')
  async updateUser(
    @Response() response,
    @Body() body: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<User> {
    const result = await this.userService.update(body, id);

    return response.status(HttpStatus.OK).json(result);
  }
}
