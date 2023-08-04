import { ApiProperty } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../consts';
import { PreparePayloadTokenDto } from '../dto/requestToken.dto';
import { classToPlain } from 'class-transformer';
import { decrypt } from '../../tools/crypto.tool';
import { TokenStateDto } from '../dto/tokenState.dto';
import { CustomError } from '../../tools/errors/Custom.error';
import { HttpStatus } from '@nestjs/common';
import { getCallbackUrl } from '../../tools/utils.tool';

export class OAuth2 {
  constructor(private oAuthApi: string) {}

  /**
   * https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
   *
   * Payload example
   * {
   *   scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&
   *   access_type=offline&
   *   include_granted_scopes=true&
   *   response_type=code&
   *   state=state_parameter_passthrough_value&
   *   redirect_uri=https%3A//oauth2.example.com/code&
   *   client_id=client_id
   * }
   */
  @ApiProperty({
    example: {
      scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
      access_type: 'offline',
      response_type: 'code',
      state: 'state_parameter_passthrough_value',
      redirect_uri: getCallbackUrl(),
      client_id: 'client_id',
    },
    description: swaggerMessages.methods.provider.requestToken.description,
  })
  getAuthorizationUrl(params: PreparePayloadTokenDto): string {
    const queryParams = new URLSearchParams(classToPlain(params));

    return `${this.oAuthApi}?${queryParams}`;
  }

  static decryptState(state: string): TokenStateDto {
    try {
      return decrypt(state);
    } catch (error) {
      throw new CustomError({
        status: HttpStatus.BAD_REQUEST,
        reason: error.message,
        message: messages.CANNOT_DECRYPT_STRING,
      });
    }
  }
}
