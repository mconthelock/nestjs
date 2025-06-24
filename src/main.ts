import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { IpLoggerMiddleware } from './middleware/ip-logger.middleware';
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ ต้องเพิ่ม

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug'],
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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
