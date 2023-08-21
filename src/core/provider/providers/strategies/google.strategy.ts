import { OAuth2 } from '../oauth.provider';
import { validateProviderState } from '../google/state.validation';
import { CustomError } from '../../../../tools/errors/Custom.error';
import { HttpStatus } from '@nestjs/common';
import { messages } from '../../../../consts';
import { GoogleProvider } from '../google/google.provider';
import { IUserProfile } from '../google/userProfile.interface';
import { ConfigValidation } from '../google/googleConfig.validation';

export default async function GoogleStrategy(
  providerResponseData: string,
  provider: GoogleProvider,
  config: ConfigValidation,
  authCode: string,
): Promise<[IUserProfile, object]> {
  const rawState = OAuth2.decryptState(providerResponseData);

  const state = validateProviderState(rawState);

  let tokenResponse;

  try {
    tokenResponse = await provider.handleCallback(config, authCode);
  } catch (error) {
    throw new CustomError({
      status:
        error.status ||
        error.response.status ||
        HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || messages.FAIL_ON_REQUEST_AUTH_TOKEN,
      data: {
        message: error.message,
        state,
        error: error.data,
      },
    });
  }

  const userProfile = await provider.getUserProfile(tokenResponse.access_token);

  return [userProfile, tokenResponse];
}
