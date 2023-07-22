import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';

@Module({
  imports: [
    NestConfig.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
  ],
})
export class ConfigModule {}
