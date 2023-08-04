import { ConfigValidation } from './google/googleConfig.validation';
import { TokenStateDto } from '../dto/tokenState.dto';
import { PreparePayloadTokenDto } from '../dto/requestToken.dto';

export interface BaseInterfaceProvider {
  getUserProfile: (accessToken: string) => any;
  prepareTokenParams: (
    config: ConfigValidation,
    state: TokenStateDto,
  ) => PreparePayloadTokenDto;
  prepareAuthorizationUrl: (config, state: TokenStateDto) => string;
  getAuthToken: (config: object, code: string) => Promise<any>;
}
