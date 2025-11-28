import * as winston from 'winston';
import stripAnsi from 'strip-ansi'; // npm i strip-ansi
import chalk from 'chalk';
import { requestNamespace } from '../../middleware/request-id.middleware';
import { shouldIgnoreEndpoint } from './logger-ignore.config';
const DailyRotateFile = require('winston-daily-rotate-file');

const addRequestId = winston.format((info) => {
  const requestId = requestNamespace.get('requestId');
  if (requestId) {
    info.requestId = requestId;
  }
  return info;
});

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};
winston.addColors(colors);

const stripColors = winston.format((info) => {
  if (typeof info.message === 'string') {
    info.message = stripAnsi(info.message);
  }
  if (typeof info.level === 'string') {
    info.level = stripAnsi(info.level);
  }
  return info;
});

const ignoreTypeOrmEntities = winston.format((info) => {
  if (
    typeof info.message === 'string' &&
    info.message.includes('All classes found using provided glob pattern')
  ) {
    return false;
  }
  return info;
});

// format filter skip query SELECT
// ตรวจสอบว่า message มีคำว่า SELECT (กรณี TypeORM log query)
const skipSelectQuery = winston.format((info) => {
  if (
    typeof info.message === 'string' &&
    /^\[QUERY] S/i.test(info.message.trim().replace(/^"|"$/g, ''))
  ) {
    return false;
  }
  return info;
});

const skipBlankReqID = winston.format((info) => {
  if (
    info.requestId === undefined ||
    info.requestId === null ||
    info.requestId === ''
  ) {
    return false;
  }
  return info;
});

const keyColors = {
  context: chalk.cyan,
  statusCode: chalk.magenta,
  method: chalk.yellow,
  url: chalk.greenBright,
  ip: chalk.blue,
  userAgent: chalk.gray,
  userId: chalk.whiteBright,
  stack: chalk.redBright,
};

const skipError = winston.format((info) => {
  if (info.level === 'error') return false;
  return info;
});

const onlyError = winston.format((info) => {
  if (info.level === 'error') return info;
  return false;
});

// กรอง endpoints ที่ไม่ต้องการ log (ยกเว้น error)
const filterIgnoredEndpoints = winston.format((info) => {
  // ถ้าเป็น error log ให้ผ่านไปเสมอ
  if (info.level === 'error') return info;

  // ตรวจสอบว่าเป็น HTTP Request log และมี URL ที่ต้อง ignore หรือไม่
  if (typeof info.url === 'string' && shouldIgnoreEndpoint(info.url)) {
    return false; // ไม่บันทึก log
  }

  return info; // บันทึก log ปกติ
});
export const winstonConfig = {
  level: 'debug', // เพิ่ม global level
  format: winston.format.combine(
    ignoreTypeOrmEntities(),
    winston.format.timestamp(),
    addRequestId(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOGGER_CONSOLE,
      format: winston.format.combine(
        //filterIgnoredEndpoints(), // กรอง ignored endpoints
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        addRequestId(),
        ignoreTypeOrmEntities(),
        skipBlankReqID(),
        winston.format.printf(
          ({ level, message, timestamp, requestId, ...meta }) => {
            if (level !== 'error')
              return `[${chalk.gray(timestamp)}] [${level}][req:${chalk.yellow(requestId || '-')}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            else {
              let output = `[${chalk.gray(timestamp)}] [${level}][req:${chalk.yellow(requestId || '-')}]`;
              output += `\n${message}`.replace('[object Object]', '');
              for (const [key, value] of Object.entries(meta)) {
                const colorFn = keyColors[key] || ((txt) => txt);
                output += `\n${chalk.yellow(key + ':')} ${colorFn(value)}`;
              }
              return `${output}`;
            }
          },
        ),
        winston.format.colorize({ all: true }),
      ),
    }),

    new DailyRotateFile({
      dirname: 'logs/',
      filename: 'logs-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: process.env.LOGGER_FILE,
      format: winston.format.combine(
        filterIgnoredEndpoints(), // กรอง ignored endpoints
        skipError(),
        stripColors(),
        ignoreTypeOrmEntities(),
        //skipSelectQuery(),
        skipBlankReqID(),
        addRequestId(),
        winston.format.timestamp(),
        winston.format.uncolorize(),
        winston.format.json(),
      ),
    }),

    // ✅ เก็บ error แยกไฟล์
    new DailyRotateFile({
      dirname: 'logs/',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: process.env.LOGGER_ERROR,
      format: winston.format.combine(
        onlyError(), // เขียนแค่ error logs
        winston.format.timestamp(),
        addRequestId(),
        winston.format.uncolorize(), // ลบสีออก
        winston.format.json(),
      ),
    }),
  ],
};
