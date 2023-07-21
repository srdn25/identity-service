import { IsEmail, IsString } from 'class-validator';
import { messages } from '../../consts';

export class CreateUserDto {
  @IsEmail({}, { message: messages.EMAIL_SHOULD_BE_CORRECT_FORMAT })
  readonly email: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly featureFlags?: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly token?: string;
}
