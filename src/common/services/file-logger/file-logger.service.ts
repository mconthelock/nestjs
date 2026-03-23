import { Injectable } from '@nestjs/common';

import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileLoggerService {
    private readonly defaultDirectory = path.join(process.cwd(), 'public/logs');
    private readonly fallbackLogFileName = 'application.log';

    private formatError(error: unknown) {
        if (error instanceof Error) {
            return error.stack ?? error.message;
        }

        return String(error);
    }

    private resolveLogFilePath(fileName: string, directory?: string) {
        const normalizedFileName = path.normalize(fileName.trim());
        const isDirectoryPath = /[\\/]$/.test(fileName);

        if (isDirectoryPath) {
            return path.join(
                directory ?? this.defaultDirectory,
                normalizedFileName,
                this.fallbackLogFileName,
            );
        }

        const parsedPath = path.parse(normalizedFileName);
        const resolvedFileName = parsedPath.ext
            ? parsedPath.base
            : `${parsedPath.base}.log`;

        return path.join(
            directory ?? this.defaultDirectory,
            parsedPath.dir,
            resolvedFileName,
        );
    }

    async log(
        message: string,
        options: {
            fileName: string;
            directory?: string;
            error?: unknown;
        },
    ) {
        try {
            const logFilePath = this.resolveLogFilePath(
                options.fileName,
                options.directory,
            );
            await fs.mkdir(path.dirname(logFilePath), { recursive: true });
            const errorText = options.error
                ? `\n${this.formatError(options.error)}`
                : '';

            await fs.appendFile(
                logFilePath,
                `[${new Date().toISOString()}] ${message}${errorText}\n`,
                'utf8',
            );
        } catch {
            // Logging must not break the caller workflow.
        }
    }

    async readLog(options: {
        fileName: string;
        directory?: string;
        error?: unknown;
    }) {
        try {
            const logFilePath = this.resolveLogFilePath(
                options.fileName,
                options.directory,
            );
            return await fs.readFile(logFilePath, 'utf8');
        } catch {
            throw new Error('Log file not found');
        }
    }
}
