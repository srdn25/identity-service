import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../consts';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  private whereForIdOrEmail(idOrEmail) {
    return {
      ...(typeof idOrEmail === 'number'
        ? { id: idOrEmail }
        : { email: idOrEmail }),
    };
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async find(idOrEmail: number | string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: this.whereForIdOrEmail(idOrEmail),
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(dto): Promise<User> {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async update(dto: UpdateUserDto, id: number): Promise<User> {
    const updated = await this.userRepository.update(dto, {
      where: { id },
    });

    if (updated[0] > 0) {
      return this.userRepository.findOne({ where: { id } });
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async delete(idOrEmail: number | string) {
    const deleted = await this.userRepository.destroy({
      where: this.whereForIdOrEmail(idOrEmail),
    });

    if (deleted > 0) {
      return true;
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
