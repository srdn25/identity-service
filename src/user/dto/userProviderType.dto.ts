import { Provider } from '../../provider/provider.entity';
import { UserProviderWithTypeDto } from './userProviderWithType.dto';

export class UserProviderTypeDto {
  userProvider: UserProviderWithTypeDto;
  provider: Provider;
}
