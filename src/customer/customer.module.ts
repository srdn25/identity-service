import { Logger, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { AuthService } from '../auth/auth.service';
import { CustomerUser } from './customerUser.entity';

@Module({
  imports: [SequelizeModule.forFeature([Customer, CustomerUser])],
  providers: [Logger, CustomerService, AuthService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
