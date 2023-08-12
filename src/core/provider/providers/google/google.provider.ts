import { HttpStatus, Logger } from '@nestjs/common';
import { OAuth2 } from '../oauth.provider';
import { PreparePayloadTokenDto } from '../../dto/requestToken.dto';
import { encrypt } from '../../../../tools/crypto.tool';
import { ConfigValidation } from './googleConfig.validation';
import { TokenStateDto } from '../../dto/tokenState.dto';
import { HttpService } from '@nestjs/axios';
import { getCallbackUrl } from '../../../../tools/utils.tool';
import { BaseInterfaceProvider } from '../base.interface.provider';
import { CustomError } from '../../../../tools/errors/Custom.error';
import { messages } from '../../../../consts';
import { IUserProfile } from './userProfile.interface';

/**
 * Client should configure project in Google API console
 * In redirect URIs Project in the API Console Credentials page should be listed our redirect URI
 */
export class GoogleProvider extends OAuth2 implements BaseInterfaceProvider {
  private readonly providerName: string;
  constructor(
    logger: Logger,
    private httpService: HttpService,
    oAuthApi = 'https://accounts.google.com/o/oauth2/v2/auth',
  ) {
    super(oAuthApi);
    this.providerName = 'Google';
  }

  /**
   * Exchange authorization code for refresh and access tokens
   * After the web server receives the authorization code, it can exchange the authorization code for an access token.
   * Auth code can be use only one time!
   */
  async getAuthToken(config: ConfigValidation, code) {
    const payload = {
      ...config,
      code,
      grant_type: 'authorization_code',
      redirect_uri: getCallbackUrl(),
    };

    const authTokens = await this.httpService.axiosRef.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams(payload),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (!authTokens?.data?.access_token || authTokens.status !== 200) {
      throw new CustomError({
        status: authTokens.status || HttpStatus.BAD_REQUEST,
        message: messages.HAS_NOT_ACCESS_TOKEN_IN_RESPONSE,
      });
    }

    return authTokens.data;
  }

  /**
   * Need create link and send it to user. Then user will see Google Auth page
   * with buttons "Accept" or "Decline" authorization.
   *
   * Google will send request to our callback URL with authCode in query params,
   * if user clicked "Accept" on authorization page.
   *
   * This "code" from callback we can use for get jwt tokens
   *
   * Example response to our callback
   *
   * http://localhost:3355/identity-provider/provider/callback/google?
   * state=NjU2NTE1ZTdiZGI4YjU4OTQzOGNkYTJkMjc0NDBmM2Q%3D
   * &code=4%2F0AZEOvhXGCvy74zlthvnuV_k9JHsuIwrbNk-3vHog7U8JMYaLH
   * &scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email
   * &authuser=0
   * &prompt=consent
   */
  prepareAuthorizationUrl(config, state): string {
    const payload = this.prepareTokenParams(config, state);

    return this.getAuthorizationUrl(payload);
  }

  prepareTokenParams(
    config: ConfigValidation,
    state: TokenStateDto,
  ): PreparePayloadTokenDto {
    return {
      scope: 'openid profile email',
      access_type: 'offline',
      response_type: 'code',
      redirect_uri: `http://${process.env.HOST}:${process.env.PORT}/${process.env.HOST_PREFIX}/provider/callback`,
      state: encrypt(state),
      client_id: config.client_id,
      prompt: 'consent',
    };
  }

  async getUserProfile(accessToken: string): Promise<IUserProfile> {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          params: {
            alt: 'json',
            access_token: accessToken,
          },
        },
      );

      if (!response.data?.email || response.status !== 200) {
        // todo: refresh token if need it
        throw new CustomError({
          status: response.status || HttpStatus.BAD_REQUEST,
          data: response.data,
          message: messages.HAS_NOT_EMAIL_IN_RESPONSE,
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      // if error.response.status 401 - need refresh token
      throw new CustomError({
        status: error.response?.status,
        message: error.message || messages.GOT_ERROR_ON_GETTING_USER_PROFILE,
        data: {
          providerName: this.providerName,
        },
      });
    }
  }

  async refreshAuthToken(refreshToken, providerConfig: ConfigValidation) {
    try {
      const response = await this.httpService.axiosRef.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          client_id: providerConfig.client_id,
          client_secret: providerConfig.client_secret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      // if 401 - refresh token is not valid, need delete user credentials from database
      throw new CustomError({
        status: error.response?.status,
        message: error.message || messages.GOT_ERROR_ON_REFRESH_USER_TOKEN,
      });
    }
  }
}
