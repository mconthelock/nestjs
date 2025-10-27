import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseService } from '../shared/database.service';
import * as oracledb from 'oracledb';

@Injectable()
export class PromoteService {
  constructor(private dbService: DatabaseService) {}

  async findAll(credentials: any, body: any) {
    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(credentials);
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;

      const { passkey } =
        await this.dbService.getHrAdminCredentials(credentials);

      const result = await conn.execute(
        `DECLARE v_cursor SYS_REFCURSOR;
          BEGIN
              PROMOTE(:KEYVALUE, :EFFDATE, :EMTYPE, v_cursor);
              :result := v_cursor;
          END;`,
        {
          KEYVALUE: passkey,
          EFFDATE: body.period,
          EMTYPE: body.type,
          result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const resultSet = result.outBinds.result;
      const rows = await resultSet.getRows();
      await resultSet.close();
      return rows;
    } catch (error) {
      if (error.message.includes('ORA-01017')) {
        throw new UnauthorizedException(
          'Invalid credentials for sensitive data access.',
        );
      }
      console.error('Error fetching Twi 50 data:', error);
      throw new InternalServerErrorException('Failed to fetch Twi 50 data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }

  async findById(credentials: any, body: any) {
    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(credentials);
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;

      // Add your query logic here
      const { passkey } =
        await this.dbService.getHrAdminCredentials(credentials);
      const result = await conn.execute(
        `DECLARE v_cursor SYS_REFCURSOR;
          BEGIN
              PROMOTEEMPLOYEE(:KEYVALUE, :EFFDATE, :EMPNO, v_cursor);
              :result := v_cursor;
          END;`,
        {
          KEYVALUE: passkey,
          EFFDATE: body.period,
          EMPNO: body.empno,
          result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const resultSet = result.outBinds.result;
      const rows = await resultSet.getRow();
      await resultSet.close();
      return rows;
    } catch (error) {
      console.error('Error fetching Twi 50 data:', error);
      throw new InternalServerErrorException('Failed to fetch Twi 50 data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }
}
