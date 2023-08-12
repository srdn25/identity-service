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
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../consts';
import { User } from './user.entity';
import { AuthStaticTokenGuard } from '../../auth/authStaticToken.guard';

@ApiTags(swaggerMessages.tags.user.tag)
@Controller('users')
export class UserController {
  constructor(
    private logger: Logger,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthStaticTokenGuard)
  @ApiOperation({ summary: swaggerMessages.requests.user.getAll.name })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [User],
    description: swaggerMessages.requests.user.getAll.description,
  })
  @Get()
  async getAll(@Response() response, @Request() request): Promise<User[]> {
    const result = await this.userService.findAll(request.customer.id);
    return response.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthStaticTokenGuard)
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
      request.customer?.id &&
      !user.customers.some((customer) => customer.id === request.customer.id)
    ) {
      throw new UnauthorizedException();
    }

    return response.status(HttpStatus.OK).json(user);
  }

  @UseGuards(AuthStaticTokenGuard)
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
      request.customer?.id &&
      !user.customers.some((customer) => customer.id === request.customer.id)
    ) {
      throw new UnauthorizedException();
    }

    const result = await this.userService.delete(idOrEmail);

    return response.status(HttpStatus.OK).json(result);
  }
}
