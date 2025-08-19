import { Request } from 'express';
export function getClientIP(req: Request): string {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         'unknown';
}