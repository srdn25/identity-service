import { Length } from 'class-validator';
import { validateData } from '../../../../tools/validateData.validation';

/**
 * https://docs.nestjs.com/techniques/configuration#custom-validate-function
 */
export class ConfigValidation {
  @Length(5)
  client_id: string;

  @Length(5)
  client_secret: string;
}

export function validateProviderConfig(config) {
  return validateData(config, ConfigValidation);
}
