import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { decrypt } from '../tools/crypto.tool';
import { CustomerService } from '../customer/customer.service';
import { CustomError } from '../tools/errors/Custom.error';

@Injectable()
export class AuthStaticTokenGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    @Inject(forwardRef(() => CustomerService))
    private customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['static-auth'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // customerId, date: unix
      // check - it is our token or not
      await decrypt(token);

      // find user by token in database, for don't allow use old tokens
      const customer = await this.customerService.findByStaticToken(token);

      if (!customer) {
        throw new CustomError({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Probably you are use old staticToken. Update the token in headers static-auth in your request, and try again',
        });
      }

      request.customer = customer;
    } catch (error) {
      const message = error.message || 'Failed to decrypt static token';

      this.logger.error({
        message,
        error,
      });

      throw new CustomError({
        status: error.status || HttpStatus.UNAUTHORIZED,
        message,
      });
    }
    return true;
  }
}
