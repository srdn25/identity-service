export interface IDataInCallbackHash extends IDataInCallback {
  hash: string;
}

export interface IDataInCallback {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

export interface ITelegramConfig {
  bot_id: string;
}
