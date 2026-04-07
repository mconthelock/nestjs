import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BackgroundTaskService } from './background-task.service';
import { BackgroundTaskController } from './background-task.controller';
import { BackgroundTaskProcessor } from './background-task.processor';
import { BackgroundTaskRegistry } from './background-task.registry';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'generic-background-queue',
            connection: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
                password: process.env.REDIS_PASSWORD,
            },
        }),
    ],
    controllers: [BackgroundTaskController],
    providers: [
        BackgroundTaskService,
        BackgroundTaskRegistry,
        BackgroundTaskProcessor,
    ],
    exports: [BackgroundTaskService, BackgroundTaskRegistry],
})
export class BackgroundTaskModule {}
