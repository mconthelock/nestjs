import { Injectable, OnModuleInit } from '@nestjs/common';
import * as odbc from 'odbc';

@Injectable()
export class ConectionService {
  private connection: odbc.Connection;

  async onModuleInit() {
    try {
      this.connection = await odbc.connect(
        'DRIVER={iSeries Access ODBC Driver};SYSTEM=AMEC400;UID=OGGUSER;PWD=OGGUSER',
      );
      console.log('✅ Connected to IBM AS400');
    } catch (error) {
      console.error('❌ Connection failed:', error);
    }
  }

  async runQuery(sql: string): Promise<any[]> {
    try {
      const result = await this.connection.query(sql);
      return result;
    } catch (err) {
      console.error('❌ Query error:', err);
      throw err;
    }
  }

  async close() {
    await this.connection.close();
    console.log('🔌 Connection closed');
  }
}
