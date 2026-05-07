import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';

import { JobExecutionLog } from 'src/common/Entities/docinv/table/job-log.entity';
import { ScheduledJob } from 'src/common/Entities/docinv/table/scheduled-job.entity';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature(
            [ScheduledJob, JobExecutionLog],
            'docinvConnection',
        ),
    ],
    controllers: [SchedulerController],
    providers: [SchedulerService],
})
export class SchedulerModule {}
