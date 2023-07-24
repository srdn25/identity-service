import { CustomError } from './Custom.error';
import { messages } from '../../consts';

export class ValidationError extends CustomError {
  status: number;
  reason: string[] | object | string;
  constructor(error) {
    super(error.message || messages.VALIDATION_ERROR);
    this.status = error.status;
    this.reason = error.reason;
    this.message = error.message || messages.VALIDATION_ERROR;
  }
}
