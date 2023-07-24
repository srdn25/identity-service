import { AxiosError } from 'axios';
import { CustomError } from './Custom.error';

export class RequestError extends CustomError {
  public status: number;
  public response: any;
  public url: string;
  public method: string;

  constructor(error) {
    super(error.message);
    const isAxios = error instanceof AxiosError;
    this.status = isAxios ? error.response.status : 500;
    this.response = isAxios ? error.response.data : '';

    const { url, method } = error.config;
    this.url = isAxios ? url : '';
    this.method = isAxios ? method.toUpperCase() : '';
  }
}
