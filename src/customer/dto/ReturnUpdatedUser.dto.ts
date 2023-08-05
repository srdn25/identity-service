import { User } from '../../user/user.entity';

export class ReturnUpdatedUserDto extends User {
  featureFlags: string;
}
