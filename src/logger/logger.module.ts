import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerController } from './logger.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [LoggerController],
})
export class LoggerModule {}
