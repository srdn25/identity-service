import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { messages } from '../consts';
import { SequelizeError } from '../tools/errors/SequelizeError.error';
import { Customer } from '../customer/customer.entity';
import { UserProvider } from './userProvider.entity';
import * as dbHelper from '../tools/dbHelper.tool';
import { Sequelize } from 'sequelize';
import { Provider } from '../provider/provider.entity';
import { UserProviderWithTypeDto } from './dto/userProviderWithType.dto';
import { ProviderType } from '../provider/providerType.entity';

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
  async findAll(customerId: number): Promise<User[]> {
    return this.userRepository.findAll({
      order: [['id', 'ASC']],
      attributes: {
        include: [
          [
            Sequelize.col('customers->CustomerUser.featureFlags'),
            'featureFlags',
          ],
        ],
      },
      include: [
        {
          model: Customer,
          required: true,
          attributes: [],
          through: {
            as: 'CustomerUser',
            where: {
              customerId,
            },
          },
        },
      ],
    });
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
  ): Promise<UserProviderWithTypeDto> {
    return dbHelper.find(
      this.userProviderRepository,
      { userId, providerId },
      null,
      {
        include: [
          {
            attributes: [],
            model: Provider,
            include: [ProviderType],
          },
        ],
        attributes: {
          include: [[Sequelize.col('provider.type.name'), 'providerType']],
        },
      },
    );
  }

  async createOrUpdateUserProvider(
    userId: number,
    providerId: number,
    config: object,
    profile: object,
  ): Promise<UserProvider | UserProviderWithTypeDto> {
    try {
      let userProvider: UserProvider | UserProviderWithTypeDto =
        await this.findUserProvider(userId, providerId);

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
