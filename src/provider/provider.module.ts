import { Logger, Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './provider.entity';
import { ProviderType } from './providerType.entity';
import { HttpModule } from '@nestjs/axios';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Provider, ProviderType]),
    HttpModule,
    CustomerModule,
    UserModule,
  ],
  providers: [Logger, ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule {}
