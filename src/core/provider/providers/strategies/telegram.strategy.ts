import { TelegramProvider } from '../telegram/telegram.provider';
import { IDataInCallback, ITelegramConfig } from '../telegram/common.interface';

export default function TelegramStrategy(
  providerResponseData: string,
  provider: TelegramProvider,
  config: ITelegramConfig,
): [IDataInCallback, null] {
  const result = provider.handleCallback(config, providerResponseData);
  return [result, null];
}
