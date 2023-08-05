import { UserProvider } from '../userProvider.entity';

export class UserProviderWithTypeDto extends UserProvider {
  providerType: string;
}
