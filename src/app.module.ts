import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
