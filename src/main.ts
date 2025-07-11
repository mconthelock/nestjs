import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { IpLoggerMiddleware } from './middleware/ip-logger.middleware';
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ ต้องเพิ่ม
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as oracledb from 'oracledb';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
console.log('ORACLE POOL CONFIG', oracledb.poolMax, oracledb.poolMin, oracledb.queueTimeout, oracledb.queueMax);
const pool = await oracledb.getPool();
console.log(pool.poolMax, pool.poolMin, pool.queueTimeout, pool.queueMax);
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
  app.use(new IpLoggerMiddleware().use);

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
