import { IsString } from 'class-validator';
import { messages, swaggerMessages } from '../../consts';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'canCreate canUpdate canDelete showNewFeature',
    description: swaggerMessages.entities.user.featureFlag.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly featureFlags?: string;

  @ApiProperty({
    example: '5c3df910-bdda-416d-83ee-6eecc5c47c48',
    description: swaggerMessages.entities.user.token.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly token?: string;
}
