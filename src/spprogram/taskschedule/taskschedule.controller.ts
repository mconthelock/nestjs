import { Controller, Post, Body } from '@nestjs/common';
import { TaskscheduleService } from './taskschedule.service';

@Controller('sp/taskschedule')
export class TaskscheduleController {
    constructor(private readonly task: TaskscheduleService) {}

    @Post('powerbi-report')
    create() {
        return null; //this.task.sendMail();
    }

    @Post('mails')
    mails(@Body() body: any) {
        return this.task.sendMail(body);
    }

    @Post('check-prebm')
    checkPrebm() {
        return this.task.checkPrebm();
    }
}
