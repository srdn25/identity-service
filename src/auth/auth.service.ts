import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/authPayload.dto';
import { CustomerService } from '../core/customer/customer.service';
import { ProviderService } from '../core/provider/provider.service';
import { UserProviderWithTypeDto } from '../core/user/dto/userProviderWithType.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
    @Inject(forwardRef(() => ProviderService))
    private readonly providerService: ProviderService,
  ) {}

  encryptData(payload: AuthPayloadDto): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Find user in CustomerUser model, use credentials from there, and get the user
   * profile from provider. Update in db and return as response
   */
  async authenticateUser(customerId: number, userId: number) {
    const userAndProvider = await this.customerService.getCustomerUser(
      customerId,
      userId,
    );

    // in instance userProvider cannot get created dynamic column 'providerType'
    const userProviderPlain: UserProviderWithTypeDto =
      userAndProvider.userProvider.toJSON();

    return this.providerService.getProfileFromProviderAndSave(
      userId,
      userProviderPlain.providerId,
      userProviderPlain.providerType,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userProviderPlain.config,
      userAndProvider.provider.config,
    );
  }
}
