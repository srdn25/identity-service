import { validateData } from '../../../tools/validateData.validation';
import { AccessTokenResponseDto } from '../../dto/accessTokenResponse.dto';

/**
 * https://docs.nestjs.com/techniques/configuration#custom-validate-function
 */

export function validateAccessTokenResponse(data) {
  return validateData(data, AccessTokenResponseDto);
}
