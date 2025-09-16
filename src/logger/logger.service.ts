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

  async checkDocinv(): Promise<{ status: string; message?: string }> {
    const queryRunner = this.docinvDs.createQueryRunner();
    try {
      await queryRunner.query(`SELECT 'DOCINV', sysdate FROM dual@DATACENTER`);
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
      await queryRunner.query(`SELECT 'SPSYS', sysdate FROM dual@AMECDC`);
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
      await queryRunner.query(`SELECT 'WEBFORM', sysdate FROM dual@AMECDC`);
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
      await queryRunner.query(`SELECT 'DAILYIDS', sysdate FROM dual@DAILYIDS`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    } finally {
      await queryRunner.release();
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
      }
    }, 600_000);
  }
}
