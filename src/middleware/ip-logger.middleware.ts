import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestNamespace } from './request-id.middleware';

@Injectable()
export class IpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;
    const route = `${req.method} ${req.originalUrl}`;
    (req as any).clientIp = ip;
    requestNamespace.set('ip', ip);
    next();
  }
}
