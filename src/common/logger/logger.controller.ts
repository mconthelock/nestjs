import { Controller, Get, Query, Inject } from '@nestjs/common';
import { LoggerService } from './logger.service';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

@Controller('logger')
export class LoggerController {
  private logDir = path.join(process.cwd(), 'logs');
  constructor(private readonly logger: LoggerService) {}

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

    // อ่านไฟล์ logs หลัก + split เป็น JSON ต่อบรรทัด
    const content = fs.readFileSync(filePath, 'utf-8');
    const mainLogs = content
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });

    // อ่านไฟล์ error logs
    const errorFilename = filename.replace('logs-', 'error-');
    const errorFilePath = path.join(this.logDir, errorFilename);
    let errorLogs = [];

    if (fs.existsSync(errorFilePath)) {
      const errorContent = fs.readFileSync(errorFilePath, 'utf-8');
      errorLogs = errorContent
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return { raw: line };
          }
        });
    }

    return this.logger.processLogs(mainLogs, errorLogs);
  }

  @Get('monthly')
  async getMonthlyLogs(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const logPattern = path
      .join(this.logDir, `logs-${year}-${month.padStart(2, '0')}-*.log`)
      .replace(/\\/g, '/');

    const errorPattern = path
      .join(this.logDir, `error-${year}-${month.padStart(2, '0')}-*.log`)
      .replace(/\\/g, '/');

    // หาไฟล์ทุกวันในเดือน
    const logFiles = glob.sync(logPattern);
    const errorFiles = glob.sync(errorPattern);

    let mainLogs: any[] = [];
    let errorLogs: any[] = [];

    // อ่าน main logs
    for (const file of logFiles) {
      const data = fs.readFileSync(file, 'utf8');
      const lines = data.trim().split('\n');
      for (const line of lines) {
        try {
          mainLogs.push(JSON.parse(line));
        } catch (e) {
          // ถ้า parse ไม่ได้ ข้าม
        }
      }
    }

    // อ่าน error logs
    for (const file of errorFiles) {
      const data = fs.readFileSync(file, 'utf8');
      const lines = data.trim().split('\n');
      for (const line of lines) {
        try {
          errorLogs.push(JSON.parse(line));
        } catch (e) {
          // ถ้า parse ไม่ได้ ข้าม
        }
      }
    }

    return this.logger.processLogs(mainLogs, errorLogs);
  }
}
