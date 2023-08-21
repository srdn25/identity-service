export interface IAuthUrlConfig {
  botId: string;
}

export interface IDataInCallbackHash extends IDataInCallback {
  hash: string;
}

export interface IDataInCallback {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  /**
   * Need multiply to 1000 and can be parsed via Date
   * example: new Date(auth_date * 1000) = UTC time
   */
  auth_date: number;
}

export interface ITelegramConfig {
  botToken: string;
}
