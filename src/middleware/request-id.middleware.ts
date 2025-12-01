import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createNamespace } from 'cls-hooked';
import { Request, Response, NextFunction } from 'express';

const requestNamespace = createNamespace('request');

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request & { requestId?: string }, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    req.requestId = requestId;
    requestNamespace.run(() => {
      requestNamespace.set('requestId', requestId);
      next();
    });
  }
}

export { requestNamespace };
