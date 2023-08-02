import { SequelizeError } from './errors/SequelizeError.error';

export function getCallbackUrl(): string {
  return `${process.env.HOST}/identity-provider/provider/callback`;
}

export function SequelizeTryCatch(target, key, descriptor) {
  const fn = descriptor.value;
  descriptor.value = async (...args) => {
    try {
      await fn.apply(this, args);
    } catch (error) {
      throw new SequelizeError(error);
    }
  };
}
