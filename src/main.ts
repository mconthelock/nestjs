import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { IpLoggerMiddleware } from './middleware/ip-logger.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { promises as fs } from 'fs';
// import * as oracledb from 'oracledb';

// Log management
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RequestContextMiddleware } from './middleware/request-context.middleware';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { AllExceptionsFilter } from './common/logger/http-exception.filter';
import * as oracledb from 'oracledb';
async function bootstrap() {
  // ✅ สร้างโฟลเดอร์ก่อนเริ่มเซิร์ฟเวอร์
  const uploadPath = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`;
  await fs.mkdir(uploadPath, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: [],
  });
  console.log(
    'ORACLE POOL CONFIG',
    oracledb.poolMax,
    oracledb.poolMin,
    oracledb.queueTimeout,
    oracledb.queueMax,
  );
  // const pool = await oracledb.getPool();
  // console.log(pool.poolMax, pool.poolMin, pool.queueTimeout, pool.queueMax);
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
      transform: true, // ใช้ class-transformer (@Type)
      whitelist: true, // ตัดฟิลด์ที่ไม่ได้ประกาศใน DTO ทิ้ง
      //   forbidNonWhitelisted: true,   // ถ้ามีฟิลด์แปลก → โยน 400 แทนการตัดทิ้ง
      exceptionFactory: (errors) =>
        new BadRequestException(errors.map((e) => e.constraints)),
    }),
  );

  app.use(compression());
  app.use(cookieParser());
  app.set('trust proxy', true);
  app.use(new IpLoggerMiddleware().use);
  app.use(new RequestIdMiddleware().use);
  app.use(new RequestContextMiddleware().use);

  // Global Interceptor สำหรับ log request และ Exception Filter สำหรับ log error
  //   const logger = app.get(WINSTON_MODULE_PROVIDER);
  //   app.useGlobalFilters(new AllExceptionsFilter(logger));
  //   app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));

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
