import { RequestError } from './RequestError.error';

export class ProvidersRequestError extends RequestError {
  constructor(public providerName: string, error) {
    super(error);
  }
}
