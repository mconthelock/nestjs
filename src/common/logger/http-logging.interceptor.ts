import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { requestNamespace } from '../../middleware/request-id.middleware';
import { requestContext } from './request-context';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip, headers, user } = req;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const duration = Date.now() - startTime;
        const ctx = requestContext.getStore();

        this.logger.info('HTTP Request', {
          requestId: ctx?.requestId,
          method,
          url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent: headers['user-agent'],
          //userId: user?.id || null,
        });
      }),
    );
  }
}
