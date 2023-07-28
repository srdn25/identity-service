import { IsEmail, IsString } from 'class-validator';
import { messages, swaggerMessages } from '../../consts';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Connect Cars',
    description: swaggerMessages.entities.user.email.description,
  })
  @IsEmail({}, { message: messages.EMAIL_SHOULD_BE_CORRECT_FORMAT })
  readonly name: string;

  @ApiProperty({
    example: 'customer-company-login',
    description: swaggerMessages.entities.user.featureFlag.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly login: string;

  @ApiProperty({
    example: '416d83ec5c',
    description: swaggerMessages.entities.user.token.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly password: string;
}
