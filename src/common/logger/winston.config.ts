import * as winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
import { requestNamespace } from '../../middleware/request-id.middleware';

const DailyRotateFile = require('winston-daily-rotate-file');
const addRequestId = winston.format((info) => {
  const requestId = requestNamespace.get('requestId');
  if (requestId) {
    info.requestId = requestId;
  }
  return info;
});

export const winstonConfig = {
  format: winston.format.combine(
    winston.format.timestamp(),
    addRequestId(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        addRequestId(),
        winston.format.printf(
          ({ level, message, timestamp, requestId, ...meta }) => {
            return `[${timestamp}] [${level}] [req:${requestId || '-'}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          },
        ),
      ),
    }),
    new DailyRotateFile({
      dirname: 'logs/production/',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // เก็บย้อนหลัง 30 วัน
      level: 'info',
    }),
    new DailyRotateFile({
      dirname: 'logs/production/',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    }),
  ],
};

export const devLoggerConfig = {
  format: winston.format.combine(
    winston.format.timestamp(),
    addRequestId(),
    winston.format.json(),
  ),
  transports: [
    // ✅ แสดงใน Console (อ่านง่าย, มีสี, มี stack trace)
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        addRequestId(),
        winston.format.printf(
          ({ level, message, timestamp, requestId, ...meta }) => {
            // return `[${timestamp}] [${level}]${
            //   context ? ' [' + context + ']' : ''
            // } ${message} ${stack ? '\n' + stack : ''}`;
            return `[${timestamp}] [${level}] [req:${requestId || '-'}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          },
        ),
      ),
    }),

    // ✅ เก็บ error แยกไฟล์
    new DailyRotateFile({
      dirname: 'logs/dev/',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        addRequestId(),
        winston.format.json(),
      ),
    }),

    // ✅ เก็บทุก log ลงไฟล์ (เผื่อ trace ย้อนหลัง)
    new DailyRotateFile({
      dirname: 'logs/dev/',
      filename: 'logs-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      //   zippedArchive: true,
      //   maxSize: '20m',
      //   maxFiles: '30d',
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        addRequestId(),
        winston.format.json(),
      ),
    }),
  ],
};
