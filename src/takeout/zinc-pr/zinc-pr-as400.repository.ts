import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { ZincPrPendingResultDto } from './dto/zinc-pr-pending.dto';

@Injectable()
export class ZincPrAs400Repository {
  constructor(private readonly connection: ConectionService) {}

  private toSqlLiteral(value: string | number | null): string {
    if (value === null) {
      return 'NULL';
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new Error('AS400 insert values must be finite numbers');
      }
      return String(value);
    }

    return `'${value.replace(/'/g, "''")}'`;
  }

  private logInsertError(table: string, error: unknown): void {
    const details = error as {
      message?: string;
      name?: string;
      code?: string;
      sqlState?: string;
      odbcErrors?: unknown;
    };

    console.error(`AS400 insert into ${table} failed`, {
      message: details?.message,
      name: details?.name,
      code: details?.code,
      sqlState: details?.sqlState,
      odbcErrors: details?.odbcErrors,
    });
  }

  insertPending(rows: ZincPrPendingResultDto[]) {
    return this.connection.withTransaction(async (connection) => {
      const insertT02 = `INSERT INTO DATALIBI.T002KP (
        T02PR, T02LIN, T02CTL, T02ITM, T02TYP, T02CLS, T02DWG, T02DES,
        T02VND, T02REQ, T02REC, T02JOB, T02ORD, T02PRN, T02DEL,
        T02SCH, T02RMK
      )`;
      const insertT03 = `INSERT INTO DATALIBI.T003KP (
        T03PR, T03LIN, T03CTL, T03SEQ, T03CUS, T03REQ, T03REC
      )`;

      for (const row of rows) {
        const t02Values = [
          row.T02PR,
          row.T02LIN,
          row.T02CTL,
          row.T02ITM,
          row.T02TYP,
          row.T02CLS,
          row.T02DWG,
          row.T02DES,
          row.T02VND,
          row.T02REQ,
          row.T02REC,
          row.T02JOB,
          row.T02ORD,
          row.T02PRN,
          row.T02DEL,
          row.T02SCH,
          row.T02RMK,
        ].map((value) => this.toSqlLiteral(value)).join(', ');
        try {
          await connection.query(`${insertT02} VALUES (${t02Values})`);
        } catch (error) {
          this.logInsertError('DATALIBI.T002KP', error);
          throw error;
        }

        const t03Values = [
          row.T003KP.T03PR,
          row.T003KP.T03LIN,
          row.T003KP.T03CTL,
          row.T003KP.T03SEQ,
          row.T003KP.T03CUS,
          row.T003KP.T03REQ,
          row.T003KP.T03REC,
        ].map((value) => this.toSqlLiteral(value)).join(', ');
        try {
          await connection.query(`${insertT03} VALUES (${t03Values})`);
        } catch (error) {
          this.logInsertError('DATALIBI.T003KP', error);
          throw error;
        }
      }

      return { insertedT002: rows.length, insertedT003: rows.length };
    });
  }
}