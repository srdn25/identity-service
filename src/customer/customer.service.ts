import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './customer.entity';
import { AuthService } from '../auth/auth.service';
import {
  encrypt,
  passwordCompare,
  passwordEncrypt,
} from '../tools/crypto.tool';
import { SequelizeError } from '../tools/errors/SequelizeError.error';
import { ReturnCustomerDataDto } from './dto/returnCustomerData.dto';
import { Provider } from '../provider/provider.entity';
import { messages } from '../consts';
import { CustomError } from '../tools/errors/Custom.error';
import { ProviderType } from '../provider/providerType.entity';
import * as dbHelper from '../tools/dbHelper.tool';
import { UpdateUserDto } from '../user/dto/updateUser.dto';
import { User } from '../user/user.entity';
import { CustomerUser } from './customerUser.entity';
import { Sequelize } from 'sequelize';
import { ReturnUpdatedUserDto } from './dto/ReturnUpdatedUser.dto';
import { UserService } from '../user/user.service';
import { ProviderService } from '../provider/provider.service';
import { UserProviderTypeDto } from '../user/dto/userProviderType.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private customerRepository: typeof Customer,
    @InjectModel(CustomerUser)
    private customerUserRepository: typeof CustomerUser,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProviderService))
    private readonly providerService: ProviderService,
  ) {}

  async create(body): Promise<ReturnCustomerDataDto> {
    const password = passwordEncrypt(body.password);
    let customer;

    try {
      customer = await this.customerRepository.create({
        ...body,
        password,
      });
    } catch (error) {
      throw new SequelizeError({
        ...error,
        status: HttpStatus.BAD_REQUEST,
        reason: error.message,
        data: error.name,
      });
    }

    customer.staticToken = await encrypt({
      date: Date.now(),
      customerId: customer.id,
    });
    await customer.save();

    return customer.serialize();
  }

  async refreshStaticToken(id): Promise<Record<any, any>> {
    if (!id) {
      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        reason: messages.NEED_AUTH_FOR_REFRESH_STATIC_TOKEN,
        data: {
          id,
        },
      });
    }

    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    customer.staticToken = await encrypt({
      date: Date.now(),
      customerId: customer.id,
    });
    await customer.save();

    return customer.serialize();
  }

  async findByLogin(login: string, withPassword = false): Promise<Customer> {
    const allScopes = { attributes: { exclude: [] } };

    return dbHelper.find(
      this.customerRepository,
      { login },
      [
        {
          model: Provider,
          required: false,
          where: {
            active: true,
          },
          include: [ProviderType],
        },
      ],
      {},
      withPassword ? allScopes : {},
    );
  }

  async findById(id: number): Promise<Customer> {
    return dbHelper.find(this.customerRepository, { id }, [
      {
        model: Provider,
        required: false,
        where: {
          active: true,
        },
        include: [ProviderType],
      },
    ]);
  }

  async findByStaticToken(staticToken: string): Promise<Customer> {
    return dbHelper.find(this.customerRepository, { staticToken });
  }

  async signIn(
    login,
    password,
  ): Promise<{ customer: Customer; authToken: string }> {
    const customer = await this.findByLogin(login, true);

    if (!customer) {
      throw new HttpException(
        messages.FAILED_AUTHORIZATION,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!passwordCompare(password, customer.password)) {
      throw new HttpException(
        messages.FAILED_AUTHORIZATION,
        HttpStatus.BAD_REQUEST,
      );
    }

    const authToken = await this.authService.encryptData({
      customerId: customer.id,
      providerId: customer.providers[0]?.id || null,
    });

    return {
      customer,
      authToken,
    };
  }

  async updateUser(
    dto: UpdateUserDto,
    customerId: number,
    userId: number,
  ): Promise<ReturnUpdatedUserDto> {
    const customerUser: any = await this.customerUserRepository.findOne({
      where: { userId, customerId },
      attributes: {
        include: [
          [Sequelize.col('CustomerUser.featureFlags'), 'user.featureFlags'],
        ],
      },
      include: [User],
    });

    if (!customerUser) {
      throw new CustomError({
        status: HttpStatus.NOT_FOUND,
        message: messages.USER_NOT_FOUND,
        data: {
          customerId,
          userId,
        },
        reason: messages.USER_NOT_FOUND,
      });
    }

    if (dto.featureFlags) {
      customerUser.featureFlags = dto.featureFlags;
    }

    await customerUser.save();

    return customerUser.user;
  }

  /**
   * Each customer has own provider. So, when I find user_provider with providerId,
   * this means the result should be the user data for the current customer as well!
   * For make sure - just check relations in database models
   */
  async getCustomerUser(
    customerId: number,
    userId: number,
  ): Promise<UserProviderTypeDto> {
    const provider = await this.providerService.findActiveCustomerProvider(
      customerId,
    );

    if (!provider) {
      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        data: {
          customerId,
          userId,
        },
        message: messages.CUSTOMER_HAS_NOT_ACTIVE_PROVIDER,
      });
    }

    // find user config for active provider
    const userProvider = await this.userService.findUserProvider(
      userId,
      provider.id,
    );

    return { userProvider, provider };
  }
}
