import { IsNumber, Length } from 'class-validator';
import { validateData } from '../../../tools/validateData.validation';

/**
 * https://docs.nestjs.com/techniques/configuration#custom-validate-function
 */
export class StateValidation {
  @IsNumber()
  providerId: number;

  @IsNumber()
  customerId: number;

  @Length(3)
  providerName: string;
}

export function validateProviderState(state) {
  return validateData(state, StateValidation);
}
