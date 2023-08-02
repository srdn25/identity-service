import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { ConfigModule } from '../config/config.module';
import { Provider } from '../provider/provider.entity';
import { ProviderType } from '../provider/providerType.entity';
import { Customer } from '../customer/customer.entity';
import { CustomerUser } from '../customer/customerUser.entity';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Provider, ProviderType, Customer, CustomerUser],
      autoLoadModels: true,
    }),
  ],
})
export class DatabaseModule {}
