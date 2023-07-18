import { NestFactory } from '@nestjs/core';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD - HH:MM:SS',
          }),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('IdentityService', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  await app.listen(PORT, () => logger.info(`Server started at ${PORT} port`));
}
bootstrap();
