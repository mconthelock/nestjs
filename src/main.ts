import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ ต้องเพิ่ม
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { promises as fs } from 'fs';

// Log management
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { AllExceptionsFilter } from './common/logger/http-exception.filter';
import { SocketIoAdapter } from './common/ws/socket-io.adapter';
import { REDIS, REDIS_SUB } from './common/redis/redis.provider';
import { Redis } from 'ioredis';

async function bootstrap() {
  // ✅ สร้างโฟลเดอร์ก่อนเริ่มเซิร์ฟเวอร์
  const uploadPath = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`;
  await fs.mkdir(uploadPath, { recursive: true });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false, // ปิด logger ของ NestJS เพื่อใช้ winston แทน
  });

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      try {
        const u = new URL(origin);
        const host = u.hostname.toLowerCase();
        if (
          host === 'mitsubishielevatorasia.co.th' ||
          host.endsWith('.mitsubishielevatorasia.co.th') ||
          host === 'localhost' ||
          host === '127.0.0.1'
        ) {
          return cb(null, true);
        }
      } catch {}
      cb(new Error('HTTP CORS blocked'), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // ตัดฟิลด์ที่ไม่ได้ประกาศใน DTO ทิ้ง
      //   forbidNonWhitelisted: true,   // ถ้ามีฟิลด์แปลก → โยน 400 แทนการตัดทิ้ง
      exceptionFactory: (errors) => {
        //Map Label Decorator ใน DTO แทนชื่อฟิลด์จริง ในข้อความ Error(ถ้ามี)
        const customMessages = errors.map((error) => {
          // 1. หาว่า field นี้มี @Label แปะไว้ไหม?
          const targetPrototype = Object.getPrototypeOf(error.target);
          const labelName = Reflect.getMetadata(
            'custom:label',
            targetPrototype,
            error.property,
          );

          // 2. ถ้ามี @Label ให้ใช้ชื่อนั้น ถ้าไม่มีให้ใช้ชื่อ Field เดิม
          const displayName = labelName || error.property;

          // 3. ดึงข้อความ Error เดิมของ NestJS มา Replace ชื่อ
          const constraints = error.constraints
            ? Object.values(error.constraints).map((msg) => {
                // replace ชื่อ field เดิม (เช่น NAME) เป็น alias (เช่น First Name)
                return msg.replace(error.property, displayName);
              })
            : [];

          return {
            //field: error.property,
            message: constraints, // ส่ง array ของ error message กลับไป
          };
        });
        //new BadRequestException(errors.map((e) => e.constraints));
        return new BadRequestException({
          statusCode: 400,
          message: customMessages,
          error: 'Bad Request',
        });
      },
    }),
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.set('trust proxy', true);

  // Global Interceptor สำหรับ log request และ Exception Filter สำหรับ log error
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalInterceptors(app.get(HttpLoggingInterceptor));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // สร้าง config สำหรับ Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AMEC API')
    .setDescription('API documentation for AMEC API')
    .setVersion(process.env.VERSION)
    .addServer(process.env.APP_ENV)
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

  // 🔗 ตั้ง WS adapter กลาง—ครอบทุก @WebSocketGateway
  const wsAdapter = new SocketIoAdapter(app);
  app.useWebSocketAdapter(wsAdapter);

  await app.init();

  // ดึง client ที่สร้างใน RedisModule มาใช้ (provider)
  const pub = app.get<Redis>(REDIS); // client ปกติจาก provider
  const sub = app.get<Redis>(REDIS_SUB) || pub.duplicate(); // ถ้าอยากใช้ provider สำหรับ sub ด้วย

  // เรียกเมธอดเดียวให้ Adapter จัดการ Redis ให้
  wsAdapter.attachRedisAdapter(pub, sub);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
