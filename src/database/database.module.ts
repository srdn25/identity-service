import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../core/user/user.entity';
import { ConfigModule } from '../config/config.module';
import { Provider } from '../core/provider/provider.entity';
import { ProviderType } from '../core/provider/providerType.entity';
import { Customer } from '../core/customer/customer.entity';
import { CustomerUser } from '../core/customer/customerUser.entity';
import { UserProvider } from '../core/user/userProvider.entity';

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
      models: [
        User,
        Provider,
        ProviderType,
        Customer,
        CustomerUser,
        UserProvider,
      ],
      autoLoadModels: true,
    }),
  ],
})
export class DatabaseModule {}
