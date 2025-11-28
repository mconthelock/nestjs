import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

@Injectable()
export class LoggerService {
  private logDir = path.join(process.cwd(), 'logs');
  async processLogs(mainLogs: any[], errorLogs: any[]) {
    // รวม logs ทั้งหมด
    const allLogs = [...mainLogs, ...errorLogs];

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

        // ถ้าเป็น HTTP Request log (info level + มี method, url)
        if (log.level === 'info' && log.method && log.url) {
          group.mainLog = log;
        }
        // ถ้าเป็น debug log (เช่น [QUERY])
        else if (log.level === 'debug' && log.message.includes('[QUERY]')) {
          group.debugLogs.push(log);
        }
        // ถ้าเป็น error log
        else if (log.level === 'error') {
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

    // เรียงตาม timestamp
    mergedLogs.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return mergedLogs;
  }
}
