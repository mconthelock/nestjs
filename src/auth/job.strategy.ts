import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const keyFromHeader = request.headers['x-api-key'];
    const validKey = this.configService.get<string>('JOB_SCHEDULER_API_KEY');
    if (!validKey) {
      throw new Error('JOB_SCHEDULER_API_KEY is not set in environment');
    }

    if (keyFromHeader === validKey) {
      return true;
    }
    throw new UnauthorizedException('Invalid API Key');
  }
}
