import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../consts';
import { IsString } from 'class-validator';

export class CallbackRequestQueryDto {
  @ApiProperty({
    example: '4/0AZEOvhX4NdJhZefezMPCPsr8tCWq_xsrrv',
    description: swaggerMessages.types.callbackReqQuery.code,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  code: string;

  @ApiProperty({
    example: 'MDc2ZGNiMDg2ZjlkZI2YTFmZTEzMjczNDI5Z',
    description: swaggerMessages.types.callbackReqQuery.state,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  state: string;

  @ApiProperty({
    example: 'email profile openid',
    description: swaggerMessages.types.callbackReqQuery.scope,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  scope: string;

  @ApiProperty({
    example: '0',
    description: swaggerMessages.types.callbackReqQuery.authuser,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  authuser: string;

  @ApiProperty({
    example: 'none',
    description: swaggerMessages.types.callbackReqQuery.prompt,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  prompt: string;
}
