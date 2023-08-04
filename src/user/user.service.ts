import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { InjectModel } from '@nestjs/sequelize';
import { messages } from '../consts';
import { SequelizeError } from '../tools/errors/SequelizeError.error';
import { Customer } from '../customer/customer.entity';
import { UserProvider } from './userProvider.entity';
import * as dbHelper from '../tools/dbHelper.tool';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserProvider)
    private userProviderRepository: typeof UserProvider,
  ) {}

  private whereForIdOrEmail(idOrEmail) {
    return {
      ...(/^\d+$/.test(idOrEmail)
        ? { id: Number(idOrEmail) }
        : { email: idOrEmail }),
    };
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  find(idOrEmail: number | string): Promise<User> {
    return this.userRepository.findOne({
      where: this.whereForIdOrEmail(idOrEmail),
    });
  }

  async create(email: string, customer: Customer): Promise<User> {
    let user;

    try {
      user = await this.userRepository.create({ email });
      await user.$set('customers', [customer.id]);
      user.customers = [customer];
    } catch (error) {
      throw new SequelizeError({
        ...error,
        reason: messages.CANNOT_CREATE_USER,
        data: {
          email,
        },
      });
    }

    return user;
  }

  async update(dto: UpdateUserDto, id: number): Promise<User> {
    const updated = await this.userRepository.update(dto, {
      where: { id },
    });

    if (updated[0] > 0) {
      return this.userRepository.findOne({ where: { id } });
    }

    throw new HttpException(messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async delete(idOrEmail: number | string) {
    const deleted = await this.userRepository.destroy({
      where: this.whereForIdOrEmail(idOrEmail),
    });

    if (deleted > 0) {
      return deleted;
    }

    throw new HttpException(messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  async findUserProvider(
    userId: number,
    providerId: number,
  ): Promise<UserProvider> {
    return dbHelper.find(this.userProviderRepository, { userId, providerId });
  }
  async createOrUpdateUserProvider(
    userId: number,
    providerId: number,
    config: object,
    profile: object,
  ): Promise<UserProvider> {
    try {
      let userProvider = await this.findUserProvider(userId, providerId);

      if (!userProvider) {
        userProvider = await this.userProviderRepository.create({
          userId,
          providerId,
          config,
          profile,
        });
      } else {
        userProvider.profile = profile;
        userProvider.config = config;
      }

      await userProvider.save();

      return userProvider;
    } catch (error) {
      throw new SequelizeError(error);
    }
  }
}
