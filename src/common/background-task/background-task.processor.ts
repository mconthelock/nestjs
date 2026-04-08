import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BackgroundTaskRegistry } from './background-task.registry';
import { Logger } from '@nestjs/common';

@Processor('generic-background-queue') // ใช้ Queue ชื่อเดียวเป็นทางผ่านหลัก
export class BackgroundTaskProcessor extends WorkerHost {
    private readonly logger = new Logger(BackgroundTaskProcessor.name);

    constructor(private registry: BackgroundTaskRegistry) {
        super();
    }

    async process(job: Job<{ taskName: string; data: any }>): Promise<void> {
        const { taskName, data } = job.data;
        const handler = this.registry.getHandler(taskName);

        if (!handler) {
            this.logger.error(`No handler found for task: ${taskName}`);
            return;
        }

        try {
            this.logger.log(`Executing task: ${taskName}`);
            await handler(data); // รันฟังก์ชันที่ Dev ลงทะเบียนไว้
        } catch (error) {
            this.logger.error(`Task ${taskName} failed: ${error.message}`);
            throw error; // เพื่อให้ BullMQ ทำการ Retry ตามที่ตั้งค่าไว้
        }
    }
}
