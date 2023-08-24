import TelegramStrategy from './telegram.strategy';
import GoogleStrategy from './google.strategy';
import { IProviderType } from '../../common.interface';

/**
 * Strategy should return user data from identity provider
 * The data will save to our database
 */
export default {
  [IProviderType.telegram]: TelegramStrategy,
  [IProviderType.google]: GoogleStrategy,
};
