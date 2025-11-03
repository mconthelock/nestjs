import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LoggerService implements OnModuleInit {
  constructor(
    @InjectDataSource('docinvConnection')
    private readonly docinvDs: DataSource,

    @InjectDataSource('spsysConnection')
    private readonly spsysDs: DataSource,

    @InjectDataSource('webformConnection')
    private readonly webformDs: DataSource,

    @InjectDataSource('amecConnection')
    private readonly amecDs: DataSource,

    @InjectDataSource('idsConnection')
    private readonly idsDs: DataSource,
  ) {}

  async checkDocinv(): Promise<{ status: string; message?: string }> {
    try {
      await this.docinvDs.query(
        `SELECT 'DOCINV', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')  FROM A001MP@DATACENTER`,
      );
      return { status: 'ok' };
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkSpsys(): Promise<{ status: string; message?: string }> {
    try {
      await this.spsysDs.query(
        `SELECT 'SPSYS', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@AMECDC`,
      );
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkWebform(): Promise<{ status: string; message?: string }> {
    try {
      let sql = `SELECT 'WEBFORM', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@DATACENTER`;
      if (process.env.STATE == 'development')
        sql = `SELECT 'WEBFORM', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@AMECDC`;
      await this.webformDs.query(sql);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkIds(): Promise<{ status: string; message?: string }> {
    try {
      let sql = `SELECT 'IDS', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@DAILYIDS`;
      if (process.env.STATE == 'development')
        sql = `SELECT 'IDS', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@DAILYIDS`;
      await this.amecDs.query(sql);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkdailyIDS(): Promise<{ status: string; message?: string }> {
    try {
      let sql = `SELECT 'IDS', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@DATACENTER`;
      if (process.env.STATE == 'development')
        sql = `SELECT 'IDS', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM A001MP@AMECDC`;
      await this.amecDs.query(sql);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  onModuleInit() {
    setInterval(() => {
      if (process.env.HOST == 'AMEC') {
        console.log('Running check connection.');
        this.checkDocinv();
        this.checkSpsys();
        this.checkWebform();
        this.checkIds();
        this.checkdailyIDS();
      }
    }, 600_000);
  }
}
