// background-task.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class BackgroundTaskService {
    constructor(
        @InjectQueue('generic-background-queue') private queue: Queue,
    ) {}

    /**
     * @param taskName ชื่อ Task ที่ลงทะเบียนไว้
     * @param data ข้อมูลที่ต้องการส่งให้ฟังก์ชัน
     */
    async dispatch(taskName: string, data: any) {
        await this.queue.add(
            taskName,
            { taskName, data },
            {
                attempts: 5,
                backoff: { type: 'exponential', delay: 1000 },
            },
        );
    }
}
