import { Logger, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [Logger, CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
