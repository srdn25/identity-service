import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { messages } from '../../consts';
import { GoogleProvider } from './providers/google/google.provider';
import { StateValidation } from './providers/google/state.validation';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/sequelize';
import { Provider } from './provider.entity';
import { CustomError } from '../../tools/errors/Custom.error';
import { CustomerService } from '../customer/customer.service';
import { CreateProviderDto } from './dto/create.dto';
import * as dbHelper from '../../tools/dbHelper.tool';
import { UpdateProviderDto } from './dto/update.dto';
import { BaseInterfaceProvider } from './providers/base.interface.provider';
import { UserService } from '../user/user.service';
import { AccessTokenResponseDto } from './dto/accessTokenResponse.dto';
import { TelegramProvider } from './providers/telegram/telegram.provider';
import providerStrategies from './providers/strategies/index.strategy';
import { IProviderType } from './common.interface';
import { ProviderType } from './providerType.entity';
import { Sequelize } from 'sequelize-typescript';
import sequelize from 'sequelize';
import { SequelizeError } from '../../tools/errors/SequelizeError.error';

@Injectable()
export class ProviderService {
  private readonly providerList;
  private readonly providerStrategies: {
    [IProviderType.google]: (typeof providerStrategies)[IProviderType.google];
    [IProviderType.telegram]: (typeof providerStrategies)[IProviderType.telegram];
  };

  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    @InjectModel(Provider) private providerRepository: typeof Provider,
    @InjectModel(ProviderType)
    private providerTypeRepository: typeof ProviderType,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
    private readonly sequelize: Sequelize,
  ) {
    // should be like in provider_type table
    this.providerList = {
      [IProviderType.google]: GoogleProvider,
      [IProviderType.telegram]: TelegramProvider,
    };

    this.providerStrategies = providerStrategies;
  }

  private getProviderByName(providerName: string): BaseInterfaceProvider {
    const Provider = this.providerList[providerName.toLowerCase()];

    if (!Provider) {
      throw new CustomError({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          providerName,
        },
        reason: messages.USER_HAS_UNSUPPORTED_PROVIDER,
      });
    }

    return new Provider(this.logger, this.httpService);
  }

  // TODO: add JWT token for telegram check auth (for 15 min). Because TG hasn't API for get data by token
  async handleCallbackAndSaveData(
    providerType: IProviderType,
    providerResponseData,
    customerId: number,
    authCode?: string,
  ) {
    try {
      const strategy = this.providerStrategies[providerType];
      let userProfile, accessConfig;

      const provider = this.getProviderByName(providerType);

      // get customer config for active provider
      const customer = await this.customerService.findById(customerId);

      switch (String(providerType)) {
        case IProviderType.google:
          [userProfile, accessConfig] = await strategy(
            providerResponseData,
            provider,
            customer.providers[0].config,
            authCode,
          );
          break;
        case IProviderType.telegram:
          [userProfile] = await strategy(
            providerResponseData,
            provider,
            customer.providers[0].config,
            null,
          );
          break;
      }

      if (!userProfile) {
        throw new CustomError({
          message: messages.CANNOT_GET_PROVIDER_USER_DATA,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {
            customerId,
            providerType,
            providerResponseData,
          },
        });
      }

      // prefer email as guid
      const guid = userProfile.email || userProfile.id;

      let user = await this.userService.findByGuid(guid);

      if (!user) {
        user = await this.userService.create(guid, customer);
      }

      const userProvider = await this.userService.createOrUpdateUserProvider(
        user.id,
        customer.providers[0].id,
        accessConfig,
        userProfile,
      );

      return userProvider;
    } catch (error) {
      this.logger.error(error, 'provider.service.handleCallbackAndSaveData');

      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProviderConfig(
    id: number,
    customerId: number,
    data: UpdateProviderDto,
  ) {
    const provider = await this.findById(id);

    if (provider.customerId !== customerId) {
      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        data: {
          customerId,
          providerCustomerId: provider.customerId,
          providerId: id,
        },
        reason: messages.PROVIDER_OWNER_IS_NOT_A_CUSTOMER,
      });
    }
    if (data.name) {
      provider.name = data.name;
    }

    if (data.config) {
      provider.config = data.config;
    }

    await provider.save();

    return provider;
  }

  async prepareAuthorizationRequest(customerId: number): Promise<string> {
    const customer = await this.customerService.findById(customerId);

    if (!customer.providers[0]?.config) {
      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        data: customer.providers,
        reason: messages.CUSTOMER_HAS_NOT_ACTIVE_PROVIDER,
      });
    }

    const providerName = customer.providers[0].type.name;

    const provider = this.getProviderByName(providerName);

    const state: StateValidation = {
      providerId: customer.providers[0].id,
      customerId: customer.id,
      providerName,
    };

    return provider.prepareAuthorizationUrl(
      customer.providers[0]?.config,
      state,
    );
  }

  async create(data: CreateProviderDto, customerId: number): Promise<Provider> {
    const customer = await this.customerService.findById(customerId);

    if (!customer) {
      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        reason: messages.CANNOT_FIND_CUSTOMER,
        data: {
          customerId,
        },
      });
    }

    // if customer already has provider - create provider with active is false
    return this.providerRepository.create({
      ...data,
      customerId,
      active: !customer.providers[0],
    });
  }

  findById(id: number): Promise<Provider> {
    return dbHelper.find(this.providerRepository, { id: Number(id) });
  }

  findActiveCustomerProvider(customerId: number): Promise<Provider> {
    return dbHelper.find(this.providerRepository, { customerId, active: true });
  }

  async setActiveProvider(
    customerId: number,
    providerId: number,
  ): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      await Promise.all([
        this.providerRepository.update(
          { active: false },
          {
            where: { customerId, id: { [sequelize.Op.not]: providerId } },
            transaction,
          },
        ),
        this.providerRepository.update(
          { active: true },
          {
            where: { customerId, id: providerId },
            transaction,
          },
        ),
      ]);

      await transaction.commit();
    } catch (error) {
      throw new SequelizeError(error);
    }

    return true;
  }

  /**
   * Currently this method use only Google.
   * Here we can get the user data from identity provider by access token.
   *
   * Some providers do not provide API with access token. Like Telegram - we can
   * just get once the user data (when authorize)
   */
  async getProfileFromProviderAndSave(
    userId: number,
    providerId: number,
    providerType: string,
    config: AccessTokenResponseDto,
    providerConfig: object,
    retry = false,
  ) {
    const provider = this.getProviderByName(providerType);

    let userProfile;
    let userConfig = config;
    try {
      userProfile = await provider.getUserProfile(config.access_token);
    } catch (error) {
      if (!retry && error instanceof CustomError && error.status === 401) {
        // TODO: move to Google provider strategy. Each provider will have own strategy
        userConfig = await provider.refreshAuthToken(
          userConfig.refresh_token,
          providerConfig,
        );

        // go to recursive only if retry = false
        await this.getProfileFromProviderAndSave(
          userId,
          providerId,
          providerType,
          {
            refresh_token: config.refresh_token,
            ...userConfig,
          },
          providerConfig,
          true,
        );
      } else {
        throw error;
      }
    }

    const userProvider = await this.userService.createOrUpdateUserProvider(
      userId,
      providerId,
      userConfig,
      userProfile,
    );

    return userProvider.profile;
  }

  getSupportedProviders() {
    return dbHelper.findAll(this.providerTypeRepository, {});
  }
}
