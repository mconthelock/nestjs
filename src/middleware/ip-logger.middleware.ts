import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const route = `${req.method} ${req.originalUrl}`;

    console.log(`[IP Logger] ${ip} - ${route}`);

    // คุณสามารถเก็บลง database หรือไฟล์ log แทน console.log ได้เช่นกัน
    next();
  }
}
