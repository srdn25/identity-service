import { IsString } from 'class-validator';
import { messages } from '../../consts';

export class UpdateUserDto {
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly featureFlags?: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly token?: string;
}
