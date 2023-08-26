import { TelegramProvider } from '../telegram/telegram.provider';
import { IDataInCallback, ITelegramConfig } from '../telegram/common.interface';
import { BaseInterfaceProvider } from '../base.interface.provider';
import { TelegramCallbackQueryDto } from '../../dto/telegramCallbackQueryDto';

export default async function TelegramStrategy(
  providerResponseData: TelegramCallbackQueryDto,
  provider: BaseInterfaceProvider | TelegramProvider,
  config: ITelegramConfig,
): Promise<[IDataInCallback, null]> {
  const result = provider.handleCallback(config, providerResponseData);
  return [result, null];
}
