// common/logger/request-context.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextData>();
