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
    try {
      await this.docinvDs.query(
        `SELECT 'DOCINV', sysdate FROM dual@DATACENTER`,
      );
      return { status: 'ok' };
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkSpsys(): Promise<{ status: string; message?: string }> {
    try {
      await this.spsysDs.query(`SELECT 'SPSYS', sysdate FROM dual@AMECDC`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkWebform(): Promise<{ status: string; message?: string }> {
    try {
      await this.webformDs.query(`SELECT 'WEBFORM', sysdate FROM dual@AMECDC`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async checkIds(): Promise<{ status: string; message?: string }> {
    try {
      await this.amecDs.query(`SELECT 'DAILYIDS', sysdate FROM dual@DAILYIDS`);
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
      }
    }, 600_000);
  }
}
