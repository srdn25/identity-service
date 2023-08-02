import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { decrypt } from '../tools/crypto.tool';

@Injectable()
export class AuthStaticTokenGuard implements CanActivate {
  constructor(private readonly logger: Logger) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['static-auth'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // customerId, date: unix
      request.customer = await decrypt(token);
    } catch (error) {
      this.logger.error({
        message: 'Failed to decrypt static token',
        error,
      });
      throw new UnauthorizedException();
    }
    return true;
  }
}
