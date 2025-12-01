import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EarlyHeadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.method);
    
    if (req.method === 'HEAD') {
      // ตอบด้วย status 200 และจบเลย (ไม่ให้ middleware ถัดไปทำงาน)
      return res.status(200).end();
    }
    next();
  }
}
