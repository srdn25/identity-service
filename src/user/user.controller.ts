import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../consts';
import { User } from './user.entity';

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

  @ApiOperation({ summary: swaggerMessages.requests.user.create.name })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: User,
    description: swaggerMessages.requests.user.create.description,
  })
  @Post()
  async create(@Response() response, @Body() userDto: CreateUserDto) {
    const result = await this.userService.create(userDto);

    return response.status(HttpStatus.CREATED).json(result);
  }

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
    @Response() response,
    @Param('idOrEmail') idOrEmail: number | string,
  ) {
    const result = await this.userService.find(idOrEmail);

    return response.status(HttpStatus.OK).json(result);
  }

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
    @Response() response,
    @Param('idOrEmail') idOrEmail: number | string,
  ) {
    const result = await this.userService.delete(idOrEmail);

    return response.status(HttpStatus.OK).json(result);
  }
}
