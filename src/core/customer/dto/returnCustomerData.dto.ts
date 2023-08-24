import { IsNumber, IsString } from 'class-validator';
import { messages } from '../../../consts';

export class ReturnCustomerDataDto {
  @IsNumber()
  id: number;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  name: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  login: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  createdAt: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  updatedAt: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  staticToken: string;
}
