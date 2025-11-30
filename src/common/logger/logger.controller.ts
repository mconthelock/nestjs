import { Controller, Get, Query, Inject, Post, Body } from '@nestjs/common';
import { LoggerService } from './logger.service';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as zlib from 'zlib';

@Controller('logger')
export class LoggerController {
  private logDir = path.join(process.cwd(), 'logs');
  constructor(private readonly logger: LoggerService) {}

  @Post('daily')
  async getLogs(@Body() data: { sdate: string; edate?: string }) {
    let { sdate, edate } = data;
    edate = edate || sdate;
    const logs = [];
    try {
      for (const date of this.generateDateRange(sdate, edate)) {
        const logfile = `logs-${date}.log`;
        const logPath = path.join(this.logDir, logfile);
        const gzPath = path.join(this.logDir, `${logfile}.gz`);

        let filePath: string | null = null;
        if (fs.existsSync(logPath)) {
          filePath = logPath;
        } else if (fs.existsSync(gzPath)) {
          filePath = gzPath;
        }

        if (!filePath) continue;
        const normalLogs = await this.logger.readLogFile(filePath);
        const processedLogs = await this.logger.processLogs(normalLogs);
        logs.push(...processedLogs);
      }

      for (const date of this.generateDateRange(sdate, edate)) {
        const errfile = `error-${date}.log`;
        const errPath = path.join(this.logDir, errfile);
        const errgzPath = path.join(this.logDir, `${errfile}.gz`);

        let fileErrPath: string | null = null;
        if (fs.existsSync(errPath)) {
          fileErrPath = errPath;
        } else if (fs.existsSync(errgzPath)) {
          fileErrPath = errgzPath;
        }

        if (!fileErrPath) continue;
        const errorLogs = await this.logger.readLogFile(fileErrPath);
        logs.push(...errorLogs);
        //console.log(logs);
      }
    } catch (error) {
      return { error: 'ไม่พบไฟล์ log ในช่วงวันที่ที่ระบุ' };
    }
    return logs;
  }

  @Post('compress-old-logs')
  async compressOldLogs() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const compressed = [];
    const skipped = [];
    const errors = [];

    try {
      // หาไฟล์ .log ทั้งหมดใน logs directory
      const logFiles = fs
        .readdirSync(this.logDir)
        .filter((file) => file.endsWith('.log') && !file.endsWith('.gz'));

      for (const filename of logFiles) {
        // ข้ามไฟล์ของวันนี้
        if (filename.includes(today)) {
          skipped.push(filename);
          continue;
        }

        const logPath = path.join(this.logDir, filename);
        const gzPath = `${logPath}.gz`;

        // ตรวจสอบว่ามี .gz อยู่แล้วหรือไม่
        if (fs.existsSync(gzPath)) {
          // ถ้ามี .gz แล้ว ลบไฟล์ต้นฉบับ
          fs.unlinkSync(logPath);
          compressed.push({ file: filename, action: 'removed_duplicate' });
        } else {
          // บีบอัดไฟล์
          try {
            const input = fs.readFileSync(logPath);
            const output = zlib.gzipSync(input);
            fs.writeFileSync(gzPath, output);
            fs.unlinkSync(logPath); // ลบไฟล์ต้นฉบับ
            compressed.push({ file: filename, action: 'compressed' });
          } catch (err) {
            errors.push({ file: filename, error: err.message });
          }
        }
      }

      return {
        success: true,
        today,
        compressed,
        skipped,
        errors,
        summary: {
          total: logFiles.length,
          compressed: compressed.length,
          skipped: skipped.length,
          errors: errors.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  generateDateRange(sdate: string, edate: string): string[] {
    const dates: string[] = [];
    const start = new Date(sdate);
    const end = new Date(edate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  }
}
