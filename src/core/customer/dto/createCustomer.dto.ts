import { IsString } from 'class-validator';
import { messages, swaggerMessages } from '../../../consts';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Connect Cars',
    description: swaggerMessages.entities.customer.name.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly name: string;

  @ApiProperty({
    example: 'customer-company-login',
    description: swaggerMessages.entities.customer.login.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly login: string;

  @ApiProperty({
    example: '416d83ec5c',
    description: swaggerMessages.entities.customer.password.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly password: string;
}
