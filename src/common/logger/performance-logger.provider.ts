// performance-logger.provider.ts
import * as winston from 'winston';
import path from 'node:path';
const DailyRotateFile = require('winston-daily-rotate-file');

const configuredLogDir = process.env.LOGGER_DIR?.trim();
const logDir = configuredLogDir
    ? path.win32.normalize(configuredLogDir)
    : path.resolve(process.cwd(), 'logs');
console.log('Performance log directory:', logDir);

export const PERFORMANCE_LOGGER = 'PERFORMANCE_LOGGER'; // กำหนดชื่อ Token สำหรับนำไป Inject

export const PerformanceLoggerProvider = {
    provide: PERFORMANCE_LOGGER,
    useFactory: () => {
        return winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                // new winston.transports.File({
                //     filename: 'logs/webflow-performance.log',
                // }),
                new DailyRotateFile({
                    dirname: logDir,
                    filename: 'webflow-performance-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxFiles: '30d',
                    level: process.env.LOGGER_FILE,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.uncolorize(),
                        winston.format.json(),
                    ),
                }),
            ],
        });
    },
};
