import { IsNumber } from 'class-validator';
import { swaggerMessages } from '../../consts';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @ApiProperty({
    example: 3,
    description: swaggerMessages.entities.customerJwtPayload.customerId,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  readonly customerId: number;

  @ApiProperty({
    example: 123,
    description: swaggerMessages.entities.customerJwtPayload.providerId,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  readonly providerId?: number;
}
