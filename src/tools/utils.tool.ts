import * as process from 'process';

export function getCallbackUrl(): string {
  return `http://${process.env.HOST}:${process.env.PORT}/identity-provider/provider/callback`;
}
