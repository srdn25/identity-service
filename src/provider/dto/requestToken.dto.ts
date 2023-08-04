import { IsString } from 'class-validator';
import { messages, swaggerMessages } from '../../consts';
import { ApiProperty } from '@nestjs/swagger';

export class PreparePayloadTokenDto {
  @ApiProperty({
    example: 'openid profile email',
    description: swaggerMessages.methods.provider.requestToken.properties.scope,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly scope: string;

  @ApiProperty({
    example: 'offline',
    description:
      swaggerMessages.methods.provider.requestToken.properties.accessType,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly access_type: string;

  @ApiProperty({
    example: 'code',
    description:
      swaggerMessages.methods.provider.requestToken.properties.responseType,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly response_type: string;

  @ApiProperty({
    example: 'ecrypted state 4/P7q7W91a-oMsCeLvIaQm6bTrgtp7',
    description: swaggerMessages.methods.provider.requestToken.properties.state,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly state: string;

  @ApiProperty({
    example: 'http://localhost:8080/callback/google/',
    description:
      swaggerMessages.methods.provider.requestToken.properties.redirectUrl,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly redirect_uri: string;

  @ApiProperty({
    example: '74103-i6061tits1l5vlo.apps.googleusercontent.com',
    description:
      swaggerMessages.methods.provider.requestToken.properties.clientId,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly client_id: string;

  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly prompt: string;
}
