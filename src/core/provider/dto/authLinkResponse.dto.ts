import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../../consts';
import { IsString } from 'class-validator';

export class AuthLinkResponseDto {
  @ApiProperty({
    example: `https://accounts.google.com/o/oauth2/v2/auth?scope=profile&access_type=offline&response_type=code&redirect_uri=http://localhost:3355/${process.env.HOST_PREFIX}/provider/callback/google&state=NjU2NTE1ZTdiZ&client_id=188103974103-&include_granted_scopes=true`,
    description: swaggerMessages.methods.provider.authLinkResponse.description,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly link: string;
}
