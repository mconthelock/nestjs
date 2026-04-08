import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BackgroundTaskRegistry {
    private tasks = new Map<string, (data: any) => Promise<void>>();

    registerTask(name: string, handler: (data: any) => Promise<void>) {
        this.tasks.set(name, handler);
    }

    getHandler(name: string) {
        return this.tasks.get(name);
    }
}
