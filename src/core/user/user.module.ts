import { forwardRef, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserProvider } from './userProvider.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserProvider]),
    forwardRef(() => CustomerModule),
  ],
  controllers: [UserController],
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {}
