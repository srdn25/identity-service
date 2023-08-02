import { ValidationError } from './Validation.error';

export class SequelizeError extends ValidationError {
  constructor(error) {
    let messages = [];

    if (error.errors && error.errors.length) {
      messages = error.errors.map((err) => err.message);
    }

    super({ messages });
  }
}
