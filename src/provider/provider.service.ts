import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { messages } from '../consts';
import { GoogleProvider } from './providers/google/google.provider';
import { OAuth2 } from './providers/oauth.provider';
import {
  StateValidation,
  validateProviderState,
} from './providers/google/state.validation';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/sequelize';
import { Provider } from './provider.entity';
import { CustomError } from '../tools/errors/Custom.error';
import { CustomerService } from '../customer/customer.service';
import { CreateProviderDto } from './dto/create.dto';
import * as dbHelper from '../tools/dbHelper.tool';
import { UpdateProviderDto } from './dto/update.dto';
import { BaseInterfaceProvider } from './providers/base.interface.provider';
import { UserService } from '../user/user.service';
import { AccessTokenResponseDto } from './dto/accessTokenResponse.dto';

@Injectable()
export class ProviderService {
  private readonly providerList;

  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    @InjectModel(Provider) private providerRepository: typeof Provider,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
  ) {
    // should be like in provider_type table
    this.providerList = {
      Google: GoogleProvider,
    };
  }

  private getProviderByName(providerName: string): BaseInterfaceProvider {
    const Provider = this.providerList[providerName];

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

  async handleCallbackAndSaveData(encryptedState, authCode) {
    try {
      const rawState = OAuth2.decryptState(encryptedState);

      const state = validateProviderState(rawState);

      const customer = await this.customerService.findById(state.customerId);

      const provider = this.getProviderByName(customer.providers[0]?.type.name);

      let tokenResponse;
      try {
        tokenResponse = await provider.getAuthToken(
          customer.providers[0].config,
          authCode,
        );
      } catch (error) {
        throw new CustomError({
          status:
            error.status ||
            error.response.status ||
            HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || messages.FAIL_ON_REQUEST_AUTH_TOKEN,
          data: {
            message: error.message,
            state,
            error: error.data,
          },
        });
      }

      const userProfile = await provider.getUserProfile(
        tokenResponse.access_token,
      );

      let user = await this.userService.find(userProfile.email);

      if (!user) {
        user = await this.userService.create(userProfile.email, customer);
      }

      const userProvider = await this.userService.createOrUpdateUserProvider(
        user.id,
        customer.providers[0].id,
        tokenResponse,
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

  async prepareAuthorizationRequest(customerId): Promise<string> {
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
}
