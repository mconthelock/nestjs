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
  ) {}

  async check(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.docinvDs.createQueryRunner();
    try {
      //   queryRunner.connection.logger.logQuery = () => {};
      await queryRunner.query(
        `SELECT 'docinv' FROM A002MP@DATACENTER WHERE ROWNUM = 1`,
      );
      return { status: 'ok' };
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async checkSpsys(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.spsysDs.createQueryRunner();
    try {
      //   queryRunner.connection.logger.logQuery = () => {};
      queryRunner.query(`SELECT 'spsys' FROM A002MP@AMECDC WHERE ROWNUM = 1`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async checkWebform(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.webformDs.createQueryRunner();
    try {
      //   queryRunner.connection.logger.logQuery = () => {};
      queryRunner.query(`SELECT 'webform' FROM A002MP@AMECDC WHERE ROWNUM = 1`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async checkIds(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.amecDs.createQueryRunner();
    try {
      //   queryRunner.connection.logger.logQuery = () => {};
      queryRunner.query(
        `SELECT 'ids' FROM RTNLIBF_A002MP@DAILYIDS WHERE ROWNUM = 1`,
      );
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  // run loop หลัง module init
  onModuleInit() {
    // check ทุก 14 นาที เพื่อให้ DBLINK reconnect ใหม่ เพราะ AMECMFG reject connect ทุก 15 นาที
    setInterval(() => {
      console.log('Running check connection.');
      this.check();
      this.checkSpsys();
      this.checkWebform();
      this.checkIds();
    }, 600_000);
  }
}
