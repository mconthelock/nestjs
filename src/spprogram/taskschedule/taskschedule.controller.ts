import { Controller, Post, Body } from '@nestjs/common';
import { TaskscheduleService } from './taskschedule.service';

@Controller('sp/taskschedule')
export class TaskscheduleController {
    constructor(private readonly task: TaskscheduleService) {}

    @Post('powerbi-report')
    create() {
        return this.task.sendMail();
    }

    @Post('check-prebm')
    checkPrebm() {
        return this.task.checkPrebm();
    }
}
