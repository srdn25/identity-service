import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../../consts';
import { IsNumber, IsString } from 'class-validator';

export class AccessTokenResponseDto {
  @ApiProperty({
    example:
      'a29.a0AbVbY6O6KC3FJLE2r-NDiPvyq4Xg3HTY9LNwSzAccfdsovIxDLmDpVcWhkWDH3KyE0PhmGQrxYC4TvSZwmrTVnsEsuOePBhFFPB5Oi-xbkb_T_2-nVeVH4GwUYCeiQ6zrc9sOrMF9erEXqOkbjWor_YdbHzosgaCgYKAaESARASFQFWKvPlE14p1ACe2OfWoXkt2qJ-lA0165',
    description: swaggerMessages.types.accessTokenResponse.accessToken,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly access_token: string;

  @ApiProperty({
    example: 3599,
    description: swaggerMessages.types.accessTokenResponse.expiresIn,
  })
  @IsNumber()
  readonly expires_in: number;

  @ApiProperty({
    example: '',
    description: swaggerMessages.types.accessTokenResponse.refreshToken,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly refresh_token: string;

  @ApiProperty({
    example:
      'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    description: swaggerMessages.types.accessTokenResponse.scope,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly scope: string;

  @ApiProperty({
    example: 'Bearer',
    description: swaggerMessages.types.accessTokenResponse.tokenType,
  })
  @IsString({ message: messages.SHOULD_BE_AS_STRING })
  readonly token_type: string;
}
