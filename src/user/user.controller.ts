import {
  Controller,
  Logger,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
  getAll() {
    this.logger.debug('debug getAll in user controller');
    return this.userService.findAll();
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }

  @Get('/:idOrEmail')
  getUser(@Param('idOrEmail') idOrEmail: number | string) {
    return this.userService.find(idOrEmail);
  }

  @Delete('/:idOrEmail')
  deleteUser(@Param('idOrEmail') idOrEmail: number | string) {
    return this.userService.delete(idOrEmail);
  }
}
