import { TokenStateDto } from '../dto/tokenState.dto';
import { PreparePayloadTokenDto } from '../dto/requestToken.dto';
import { TelegramCallbackQueryDto } from '../dto/telegramCallbackQueryDto';
import { ITelegramConfig } from './telegram/common.interface';

export interface BaseInterfaceProvider {
  /**
   * Get the user info from provider
   */
  getUserProfile?: (accessToken: string) => any;

  /**
   * Prepare params for authorization link. Use in prepareAuthorizationUrl
   */
  prepareAuthParams?: (config, state) => PreparePayloadTokenDto | object;

  /**
   * Prepare authorization link for the user. Need redirect the user by this link
   * The user will see authorization page of active provider
   */
  prepareAuthorizationUrl: (config, state: TokenStateDto) => string;

  /**
   * Handle callback, get data after authorization.
   * Provider will send data to us, on our callback webhook
   */
  handleCallback: (
    config: object | ITelegramConfig,
    code: string | TelegramCallbackQueryDto,
    customerId?: number,
  ) => any;

  /**
   * Update authorization token, when it expired. Use for that refresh token -
   * provided on callback after login the user
   */
  refreshAuthToken?: (refreshToken: string, providerConfig) => Promise<any>;
}
