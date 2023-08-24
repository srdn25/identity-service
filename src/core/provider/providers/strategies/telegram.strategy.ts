import { TelegramProvider } from '../telegram/telegram.provider';
import { IDataInCallback } from '../telegram/common.interface';
import { BaseInterfaceProvider } from '../base.interface.provider';

export default async function TelegramStrategy(
  providerResponseData: string,
  provider: BaseInterfaceProvider | TelegramProvider,
  config,
): Promise<[IDataInCallback, null]> {
  const result = provider.handleCallback(config, providerResponseData);
  return [result, null];
}
