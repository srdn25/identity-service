import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { SequelizeTryCatch } from '../tools/utils.tool';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private customerRepository: typeof Customer,
    private authService: AuthService,
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

  @SequelizeTryCatch
  async find(where, include): Promise<Customer> {
    return this.customerRepository.findOne({ where, include });
  }

  async findByLogin(login: string): Promise<Customer> {
    return this.find({ login }, [
      {
        model: Provider,
        required: false,
        where: {
          active: true,
        },
      },
    ]);
  }

  async findById(id: number): Promise<Customer> {
    return this.find({ id }, [
      {
        model: Provider,
        required: false,
        where: {
          active: true,
        },
      },
    ]);
  }

  async signIn(login, password): Promise<{ authToken: string }> {
    const customer = await this.findByLogin(login);

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
      authToken,
    };
  }
}
