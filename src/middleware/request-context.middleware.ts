// middleware/request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContext } from '../common/logger/request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    requestContext.run({ requestId: req.requestId }, () => {
      next();
    });
  }
}
