import { SetMetadata } from '@nestjs/common';

export const TX_CONNECTION_KEY = 'TX_CONNECTION';

export const UseTransaction = (connectionName: string) =>
  SetMetadata(TX_CONNECTION_KEY, connectionName);