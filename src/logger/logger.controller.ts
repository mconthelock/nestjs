import { Controller, Get, Query, Inject } from '@nestjs/common';
import { LoggerService } from './logger.service';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

@Controller('logger')
export class LoggerController {
  constructor(private readonly logger: LoggerService) {}

  private logDir = path.join(process.cwd(), 'logs');
  @Get('daily')
  async getLogs(@Query('date') date?: string) {
    // ถ้า user ไม่ใส่ date => ดึงไฟล์ล่าสุด
    const filename = date
      ? `logs-${date}.log`
      : fs.readdirSync(this.logDir).sort().reverse()[0]; // ล่าสุด

    const filePath = path.join(this.logDir, filename);

    if (!fs.existsSync(filePath)) {
      return { error: 'Log file not found' };
    }

    // อ่านไฟล์ + split เป็น JSON ต่อบรรทัด
    const content = fs.readFileSync(filePath, 'utf-8');
    const logs = content
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });

    return logs;
  }

  @Get('monthly')
  async getMonthlyLogs(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const pattern = path
      .join(this.logDir, `logs-${year}-${month.padStart(2, '0')}-*.log`)
      .replace(/\\/g, '/');

    // หาไฟล์ทุกวันในเดือน
    const files = glob.sync(pattern);
    console.log(pattern);

    let logs: any[] = [];

    for (const file of files) {
      const data = fs.readFileSync(file, 'utf8');
      const lines = data.trim().split('\n');
      for (const line of lines) {
        try {
          logs.push(JSON.parse(line)); // สมมติ winston เขียนเป็น JSON
        } catch (e) {
          // ถ้า parse ไม่ได้ ข้าม
        }
      }
    }

    return logs;
  }
}
