import { forwardRef, Logger, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomerUser } from './customerUser.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProviderModule } from '../provider/provider.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Customer, CustomerUser]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProviderModule),
  ],
  providers: [Logger, CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
