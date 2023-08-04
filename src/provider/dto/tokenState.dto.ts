import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../consts';
import { IsNumber, IsString } from 'class-validator';

export class TokenStateDto {
  @ApiProperty({
    example: 1,
    description: swaggerMessages.types.authState.customerId,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  customerId: number;

  @ApiProperty({
    example: 2,
    description: swaggerMessages.types.authState.providerId,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  providerId: number;

  @ApiProperty({
    example: 'Google',
    description: swaggerMessages.types.authState.providerName,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  providerName: string;
}
