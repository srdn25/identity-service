import { ValidationError } from './Validation.error';

export class SequelizeError extends ValidationError {
  constructor(error) {
    let data = [];

    if (error.errors && error.errors.length) {
      data = error.errors.map((err) => err.message);
    }

    super({ data, message: error.message });
  }
}
