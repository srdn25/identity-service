import { messages } from '../../consts';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationError extends HttpException {
  reason: string[] | object | string;
  messages: string[];

  constructor(error) {
    const message = error.message || messages.VALIDATION_ERROR;
    super({ ...error, message }, HttpStatus.BAD_REQUEST);
    this.messages = error.messages || [];
  }

  serialize() {
    return {
      message: this.message,
      reason: this.reason,
      messages: this.messages,
    };
  }
}
