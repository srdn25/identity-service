import { IUserProfileBase } from '../userProfile.interface';

export interface IUserProfile extends IUserProfileBase {
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}
