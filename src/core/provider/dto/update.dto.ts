import { IsObject, IsOptional, IsString } from 'class-validator';
import { messages, swaggerMessages } from '../../../consts';
import { ApiProperty } from '@nestjs/swagger';
import { ConfigValidation } from '../providers/google/googleConfig.validation';

export class UpdateProviderDto {
  @ApiProperty({
    example: 'my google provider',
    description: swaggerMessages.entities.provider.name.description,
  })
  @IsOptional()
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  name?: string;

  @ApiProperty({
    example: {
      client_id: 'hjdks135',
      client_secret: '5c3df910-bdda-416d-83ee-6eecc5c47c48',
    },
    description: swaggerMessages.entities.provider.config.description,
  })
  @IsOptional()
  @IsObject({ message: messages.SHOULD_BE_AS_OBJECT })
  config?: ConfigValidation;
}
