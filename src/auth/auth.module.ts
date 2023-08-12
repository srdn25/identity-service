import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { CustomerModule } from '../customer/customer.module';
import { ProviderModule } from '../provider/provider.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => CustomerModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
    forwardRef(() => ProviderModule),
  ],
  providers: [Logger, AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
