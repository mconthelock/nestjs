import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';
import { TX_CONNECTION_KEY } from '../decorator/transaction.decorator';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private dataSourceMap: Record<string, DataSource>;

  constructor(
    @InjectDataSource('escsConnection')
    private escsDS: DataSource,
    @InjectDataSource('webformConnection')
    private webformDS: DataSource,
    private readonly reflector: Reflector,
  ) {
    // เพิ่ม data sources ที่นี่เมื่อมีการเพิ่ม connection ใหม่
    this.dataSourceMap = {
      escsConnection: this.escsDS,
      webformConnection: this.webformDS,
    };
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    // ดึงค่า connectionName จาก metadata
    const connectionName = this.reflector.getAllAndOverride<string>(
      TX_CONNECTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // ถ้าไม่มีการระบุ connectionName ให้ข้ามการทำงานของ interceptor นี้
    if (!connectionName) {
      return next.handle();
    }
    const req = context.switchToHttp().getRequest<Request>();

    const dataSource = this.dataSourceMap[connectionName];

    if (!dataSource) {
      throw new Error(`Unknown connection: ${connectionName}`);
    }

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req[ENTITY_MANAGER_KEY] = queryRunner.manager;

    return next.handle().pipe(
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),
      catchError(async (err) => {
        await queryRunner.rollbackTransaction();
        throw err;
      }),
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
