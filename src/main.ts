import { join } from 'node:path';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

import metadata = require('../package.json');
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerMessages } from './consts';
import { GlobalHandleErrors } from './globalHandleErrors.filter';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './pipes/Validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle(metadata.name)
    .setDescription(metadata.description)
    .setVersion(metadata.version)
    .addTag(
      swaggerMessages.tags.user.tag,
      swaggerMessages.tags.user.description,
    )
    .addTag(
      swaggerMessages.tags.auth.tag,
      swaggerMessages.tags.auth.description,
    )
    .addTag(
      swaggerMessages.tags.info.tag,
      swaggerMessages.tags.info.description,
    )
    .addTag(
      swaggerMessages.tags.customer.tag,
      swaggerMessages.tags.customer.description,
    )
    .build();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  const httpAdapterHost = app.get(HttpAdapterHost);
  const appLogger = app.get(Logger);

  app.setGlobalPrefix(process.env.HOST_PREFIX);
  app.useGlobalFilters(new GlobalHandleErrors(httpAdapterHost, appLogger));
  app.useGlobalPipes(new ValidationPipe());
  app.setBaseViewsDir(join(__dirname, '..', '..', 'public'));
  app.setViewEngine('hbs');

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`/${process.env.HOST_PREFIX}/doc`, app, swaggerDocument);

  await app.listen(PORT, () => logger.info(`Server started at ${PORT} port`));
}
bootstrap();
