import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ ต้องเพิ่ม
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

// Log management
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { AllExceptionsFilter } from './common/logger/http-exception.filter';
import { winstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  app.enableCors({
    origin: [
      'https://amecwebtest.mitsubishielevatorasia.co.th',
      'https://amecwebtest1.mitsubishielevatorasia.co.th',
      'https://amecweb.mitsubishielevatorasia.co.th',
      'https://amecweb1.mitsubishielevatorasia.co.th',
      'https://amecweb2.mitsubishielevatorasia.co.th',
      'https://amecweb4.mitsubishielevatorasia.co.th',
      'http://amecwebtest.mitsubishielevatorasia.co.th',
      'http://amecwebtest1.mitsubishielevatorasia.co.th',
      'http://amecweb.mitsubishielevatorasia.co.th',
      'http://amecweb1.mitsubishielevatorasia.co.th',
      'http://amecweb2.mitsubishielevatorasia.co.th',
      'http://amecweb4.mitsubishielevatorasia.co.th',
      'http://webflow.mitsubishielevatorasia.co.th',
      'http://localhost:8080',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BadRequestException(errors.map((e) => e.constraints)),
    }),
  );

  app.use(compression());
  app.use(cookieParser());
  app.set('trust proxy', true);

  // Global Interceptor สำหรับ log request และ Exception Filter สำหรับ log error
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger({
    log: (message, context) => {
      console.log(context);
      if (
        ![
          'RouterExplorer',
          'NestApplication',
          'InstanceLoader',
          'NestFactory',
        ].includes(context)
      ) {
        console.log(context);
        logger.info(message, { context });
      }
    },
    error: (msg, trace, ctx) => logger.error(msg, { trace, context: ctx }),
    warn: (msg, ctx) => logger.warn(msg, { context: ctx }),
    debug: (msg, ctx) => logger.debug(msg, { context: ctx }),
    verbose: (msg, ctx) => logger.verbose(msg, { context: ctx }),
  });
  app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // สร้าง config สำหรับ Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AMEC API')
    .setDescription('API documentation for AMEC API')
    .setVersion(process.env.VERSION)
    //.addTag('Auth', 'ใช้สำหรับจัดการการเข้าสู่ระบบและระบบยืนยันตัวตน')
    .addTag('IS-DEV', 'Manage a IS-DEV Request')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  //SwaggerModule.setup('apidocs', app, document);
  app.use(
    '/apidocs',
    apiReference({
      content: document,
      theme: 'bluePlanet',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
