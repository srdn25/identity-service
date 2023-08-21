import { createHash, createHmac } from 'node:crypto';
import { OAuth2 } from '../oauth.provider';
import { BaseInterfaceProvider } from '../base.interface.provider';
import {
  IAuthUrlConfig,
  IDataInCallback,
  IDataInCallbackHash,
  ITelegramConfig,
} from './common.interface';
import { CustomError } from '../../../../tools/errors/Custom.error';
import { HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export class TelegramProvider extends OAuth2 implements BaseInterfaceProvider {
  private readonly providerName: string;
  constructor(
    logger: Logger,
    private httpService: HttpService,
    oAuthApi = 'https://oauth.telegram.org/auth',
  ) {
    super(oAuthApi);
    this.providerName = 'Telegram';
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
  handleCallback(config: ITelegramConfig, hash: string): IDataInCallback {
    const encodedCallbackHash: string = new Buffer(hash, 'base64').toString();
    const data: IDataInCallbackHash = JSON.parse(encodedCallbackHash);

    const result = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      photo_url: data.photo_url,
      auth_date: data.auth_date,
    };

    const secretKey = createHash('sha256').update(config.botToken).digest();
    const checkHash = createHmac('sha256', secretKey)
      .update(JSON.stringify(result))
      .digest('hex');

    if (data.hash !== checkHash) {
      throw new CustomError({
        message: 'Invalid hash',
        status: HttpStatus.BAD_REQUEST,
        data: {
          data,
        },
      });
    }

    return result;
  }

  /**
   * Data for required parameters got
   * from https://telegram.org/js/telegram-widget.js - popup_url variable
   */
  prepareAuthorizationUrl(config: IAuthUrlConfig): string {
    const payload = {
      bot_id: config.botId,
      request_access: 'write',
      // return_to: this.getCallbackUrl(this.providerName.toLowerCase()),
      return_to:
        'https://e6b4-207-161-55-187.ngrok.io/identity-provider/provider/callback/telegram',
      origin: 'https://e6b4-207-161-55-187.ngrok.io',
      // origin: `http://${process.env.HOST}:${process.env.PORT}`,
    };

    return this.getAuthorizationUrl(payload);
  }
}
