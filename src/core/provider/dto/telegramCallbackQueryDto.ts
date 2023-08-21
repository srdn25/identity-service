import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../../consts';
import { IsString } from 'class-validator';

export class TelegramCallbackQueryDto {
  @ApiProperty({
    example: 'uYW1lIjoiUXVpZXQiLCJsYXN0X25hbWUiOiJMa',
    description: swaggerMessages.types.callbackReqQuery.state,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  tgAuthResult?: string;
}
