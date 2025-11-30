import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as zlib from 'zlib';

@Injectable()
export class LoggerService {
  private logDir = path.join(process.cwd(), 'logs');

  async readLogFile(filePath: string): Promise<any[]> {
    let content: string;

    // ตรวจสอบว่าเป็นไฟล์ .gz หรือไม่
    if (filePath.endsWith('.gz')) {
      const compressed = fs.readFileSync(filePath);
      content = zlib.gunzipSync(compressed).toString('utf-8');
    } else {
      content = fs.readFileSync(filePath, 'utf-8');
    }

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

    return mainLogs;
  }

  async processLogs(allLogs: any[]) {
    // จัดกลุ่ม logs ตาม requestId
    const groupedLogs = new Map();
    const standaloneInfoLogs = [];
    for (const log of allLogs) {
      // Skip logs ของ logger controller
      if (log.url && log.url.startsWith('/logger')) {
        continue;
      }

      if (log.requestId) {
        if (!groupedLogs.has(log.requestId)) {
          groupedLogs.set(log.requestId, {
            mainLog: null,
            debugLogs: [],
          });
        }

        const group = groupedLogs.get(log.requestId);
        if (log.level === 'info' && log.method && log.url) {
          group.mainLog = log;
        } else if (log.level === 'debug' && log.message.includes('[QUERY]')) {
          group.debugLogs.push(log);
        } else if (log.level === 'error') {
          group.debugLogs.push(log);
        }
      }
      // logs ที่ไม่มี requestId หรือเป็น info/error แต่ไม่ใช่ HTTP Request
      else if (
        log.level === 'info' ||
        log.level === 'error' ||
        !log.requestId
      ) {
        standaloneInfoLogs.push(log);
      }
    }

    // รวม debug logs เข้าไปใน main log
    const mergedLogs = [];
    for (const [requestId, group] of groupedLogs) {
      if (group.mainLog) {
        const mergedLog = {
          ...group.mainLog,
          queries:
            group.debugLogs.filter((l) => l.level === 'debug').length > 0
              ? group.debugLogs.filter((l) => l.level === 'debug')
              : undefined,
          errors:
            group.debugLogs.filter((l) => l.level === 'error').length > 0
              ? group.debugLogs.filter((l) => l.level === 'error')
              : undefined,
        };
        mergedLogs.push(mergedLog);
      }
    }

    // เพิ่ม standalone logs
    mergedLogs.push(...standaloneInfoLogs);
    mergedLogs.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    return mergedLogs;
  }
}
