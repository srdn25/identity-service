import { Module } from '@nestjs/common';
import { databaseProviders } from './database.service';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
