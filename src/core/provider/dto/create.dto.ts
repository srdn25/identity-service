import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../../consts';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    example: 'my google provider',
    description: swaggerMessages.entities.provider.name.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  name: string;

  @ApiProperty({
    example: {
      client_id: 'hjdks135',
      client_secret: '5c3df910-bdda-416d-83ee-6eecc5c47c48',
    },
    description: swaggerMessages.entities.provider.config.description,
  })
  @IsObject({ message: messages.SHOULD_BE_AS_OBJECT })
  readonly config: object;

  @ApiProperty({
    example: 123,
    description: swaggerMessages.entities.provider.providerTypeId.description,
  })
  @IsNumber()
  providerTypeId: number;
}
