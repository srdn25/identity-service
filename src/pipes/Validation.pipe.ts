import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '../tools/errors/Validation.error';
import { VALIDATION_ERROR } from '../../text/general.messages.json';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform<K>(value: K, metadata: ArgumentMetadata): Promise<K> {
    const data = plainToClass(metadata.metatype, value);

    const errors = await validate(data);

    if (errors && errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });

      throw new ValidationError({ message: VALIDATION_ERROR, messages });
    }

    return value;
  }
}
