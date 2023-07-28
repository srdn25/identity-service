import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { ValidationError } from './errors/Validation.error';
import { messages } from '../consts';

export function validateData(
  data: Record<string, string>,
  ValidationSchema: ClassConstructor<any>,
) {
  if (typeof data === 'string') {
    throw new ValidationError({
      reason: messages.VALIDATION_DATA_SHOULD_BE_OBJECT,
      message: messages.VALIDATION_DATA_SHOULD_BE_OBJECT,
    });
  }

  const validatedData = plainToInstance(ValidationSchema, data, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedData, { skipMissingProperties: false });

  if (errors.length > 0) {
    const data = {
      reason: errors.map((err) => Object.values(err.constraints)),
      status: HttpStatus.CONFLICT,
    };

    throw new ValidationError(data);
  }
  return validatedData;
}
