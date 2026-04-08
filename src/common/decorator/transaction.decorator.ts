import { SetMetadata } from '@nestjs/common';

export const TX_CONNECTION_KEY = 'TX_CONNECTION';
export const FORCE_TX_KEY = 'FORCE_TX';

// ใช้เลือก connection
export const UseTransaction = (connectionName: string) =>
    SetMetadata(TX_CONNECTION_KEY, connectionName);

// ใช้บังคับให้ใช้ tx ตัวเดียวข้ามทุก repo
export const UseForceTransaction = () => SetMetadata(FORCE_TX_KEY, true);
