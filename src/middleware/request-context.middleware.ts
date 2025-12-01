// middleware/request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContext } from '../common/logger/request-context';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req:  Request & { requestId?: string }, res: Response, next: NextFunction) {
    const id = req.requestId || 'no-request-id';
    requestContext.run({ requestId: id }, () => {
      next();
    });
  }
}
