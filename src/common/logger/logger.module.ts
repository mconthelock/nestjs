import { Module } from '@nestjs/common';
import { PerformanceLoggerProvider } from './performance-logger.provider';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Module({
    controllers: [LoggerController],
    providers: [LoggerService, PerformanceLoggerProvider],
})
export class LoggerModule {}
