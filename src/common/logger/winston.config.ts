import * as winston from 'winston';
import stripAnsi from 'strip-ansi'; // npm i strip-ansi
import chalk from 'chalk';
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

export const winstonConfig = {
  format: winston.format.combine(
    ignoreTypeOrmEntities(),
    winston.format.timestamp(),
    addRequestId(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        addRequestId(),
        ignoreTypeOrmEntities(),
        winston.format.printf(
          ({ level, message, timestamp, requestId, ...meta }) => {
            if (level !== 'error')
              return `[${chalk.gray(timestamp)}] [${level}][req:${chalk.yellow(requestId || '-')}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            else {
              let output = `[${chalk.gray(timestamp)}] [${level}][req:${chalk.yellow(requestId || '-')}]`;
              const msg = `${message}`.replace('[object Object]', '');
              output += `\n${chalk.yellow(msg)}`;
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
      dirname: 'logs/production/',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
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
    ignoreTypeOrmEntities(),
    winston.format.timestamp(),
    addRequestId(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        addRequestId(),
        ignoreTypeOrmEntities(),
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
      dirname: 'logs/dev/',
      filename: 'logs-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'debug',
      format: winston.format.combine(
        // stripColors(),
        ignoreTypeOrmEntities(),
        // skipSelectQuery(),
        addRequestId(),
        winston.format.timestamp(),
        winston.format.uncolorize(),
        winston.format.json(),
      ),
    }),

    // ✅ เก็บ error แยกไฟล์
    // new DailyRotateFile({
    //   dirname: 'logs/dev/',
    //   filename: 'error-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD',
    //   zippedArchive: true,
    //   maxSize: '20m',
    //   maxFiles: '30d',
    //   level: 'error',
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     addRequestId(),
    //     winston.format.json(),
    //   ),
    // }),
  ],
};
