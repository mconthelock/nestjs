import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LoggerService implements OnModuleInit {
  constructor(
    @InjectDataSource('docinvConnection')
    private readonly dataSource: DataSource,

    @InjectDataSource('spsysConnection')
    private readonly spsysDs: DataSource,
  ) {}

  async check(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      queryRunner.connection.logger.logQuery = () => {};
      await queryRunner.query('SELECT 1 FROM DUAL');
      return { status: 'ok' };
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async checkSp(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.spsysDs.createQueryRunner();
    try {
      queryRunner.query('SELECT 1 FROM A002MP@AMECDC WHERE ROWNUM = 1');
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  // run loop หลัง module init
  onModuleInit() {
    // check ทุก 30 วินาที
    setInterval(() => {
      console.log('Running check connection.');
      this.check();
      this.checkSp();
    }, 300_000);
  }
}
