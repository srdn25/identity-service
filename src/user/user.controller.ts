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

@Controller('users')
export class UserController {
  constructor(
    private logger: Logger,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAll(@Response() response) {
    this.logger.debug('debug getAll in user controller');
    const result = await this.userService.findAll();
    return response.status(HttpStatus.OK).json(result);
  }

  @Post()
  async create(@Response() response, @Body() userDto: CreateUserDto) {
    const result = await this.userService.create(userDto);

    return response.status(HttpStatus.CREATED).json(result);
  }

  @Get('/:idOrEmail')
  async getUser(
    @Response() response,
    @Param('idOrEmail') idOrEmail: number | string,
  ) {
    const result = await this.userService.find(idOrEmail);

    return response.status(HttpStatus.OK).json(result);
  }

  @Delete('/:idOrEmail')
  async deleteUser(
    @Response() response,
    @Param('idOrEmail') idOrEmail: number | string,
  ) {
    const result = await this.userService.delete(idOrEmail);

    return response.status(HttpStatus.OK).json(result);
  }
}
