import { createHash, createHmac } from 'node:crypto';
import { OAuth2 } from '../oauth.provider';
import { BaseInterfaceProvider } from '../base.interface.provider';
import { IDataInCallback, ITelegramConfig } from './common.interface';
import { CustomError } from '../../../../tools/errors/Custom.error';
import { HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TokenStateDto } from '../../dto/tokenState.dto';
import { IProviderType } from '../../common.interface';
import { TelegramCallbackQueryDto } from '../../dto/telegramCallbackQueryDto';

export class TelegramProvider extends OAuth2 implements BaseInterfaceProvider {
  private readonly providerName: IProviderType.telegram;
  constructor(
    logger: Logger,
    private httpService: HttpService,
    oAuthApi = 'https://oauth.telegram.org/auth',
  ) {
    super(oAuthApi);
    this.providerName = IProviderType.telegram;
  }

  /**
   * Handle telegram callback. Need check tg widget from time to time
   * Currently - getting query hash #tgAuthResult, then need decrypt the hash
   * (it's base64). In encrypted hash will see user data, and security hash for
   * check valid callback data
   *
   * Function handle callback
   * from telegram widget for auth
   *
   * function haveTgAuthResult() {
   *     var locationHash = '', re = /[#\?\&]tgAuthResult=([A-Za-z0-9\-_=]*)$/, match;
   *     try {
   *       locationHash = location.hash.toString();
   *       if (match = locationHash.match(re)) {
   *         location.hash = locationHash.replace(re, '');
   *         var data = match[1] || '';
   *         data = data.replace(/-/g, '+').replace(/_/g, '/');
   *         var pad = data.length % 4;
   *         if (pad > 1) {
   *           data += new Array(5 - pad).join('=');
   *         }
   *         return JSON.parse(window.atob(data));
   *       }
   *     } catch (e) {}
   *     return false;
   *   }
   */
  handleCallback(
    config: ITelegramConfig,
    data: TelegramCallbackQueryDto,
  ): IDataInCallback {
    const result: any = Object.assign({}, data);
    delete result.hash;

    const isAuth = this.checkAuthHash(result, data.hash, config);

    if (!isAuth) {
      throw new CustomError({
        message: 'Invalid telegram hash',
        status: HttpStatus.BAD_REQUEST,
        data: {
          data,
        },
      });
    }

    result.auth_date = result.auth_date * 1000;
    return result;
  }

  /**
   * Data for required parameters got
   * from https://telegram.org/js/telegram-widget.js - popup_url variable
   */
  prepareAuthorizationUrl(
    config: ITelegramConfig,
    state: TokenStateDto,
  ): string {
    const payload = this.prepareAuthParams(config, state);

    return this.getAuthorizationUrl(payload);
  }

  prepareAuthParams(config: ITelegramConfig, state: TokenStateDto) {
    return {
      bot_id: config.bot_id,
      request_access: 'write',
      // return_to: this.getCallbackUrl(this.providerName, state.customerId),
      return_to: `https://e6b4-207-161-55-187.ngrok.io/identity-provider/provider/callback/telegram/${state.customerId}`,
      origin: 'https://e6b4-207-161-55-187.ngrok.io',
      // origin: `http://${process.env.HOST}:${process.env.PORT}`,
    };
  }

  /**
   * Checking authorization
   * You can verify the authentication and the integrity of the data received
   * by comparing the received hash parameter with the hexadecimal representation
   * of the HMAC-SHA-256 signature of the data-check-string with the SHA256
   * hash of the bot's token used as a secret key.
   *
   * Data-check-string is a concatenation of all received fields, sorted in alphabetical order,
   * in the format key=<value> with a line feed character ('\n', 0x0A) used as
   * separator – e.g., 'auth_date=<auth_date>\nfirst_name=<first_name>\nid=<id>\nusername=<username>'.
   *
   * @return boolean - True - is valid. False - not valid
   */
  checkAuthHash(data: IDataInCallback, hash: string, config: ITelegramConfig) {
    const hashPayload = Object.entries(data)
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    const secretKey = createHash('sha256').update(config.bot_id).digest();
    const checkHash = createHmac('sha256', secretKey)
      .update(hashPayload)
      .digest('hex');

    if (hash !== checkHash) {
      return false;
    }

    return true;
  }
}
