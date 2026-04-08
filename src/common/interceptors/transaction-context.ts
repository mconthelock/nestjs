// src/common/interceptors/transaction-context.ts
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export interface TransactionStore {
    manager?: EntityManager;
    forceTx?: boolean;
}

export const transactionContext = new AsyncLocalStorage<TransactionStore>();
