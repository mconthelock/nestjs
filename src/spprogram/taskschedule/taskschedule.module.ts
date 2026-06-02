import { Module } from '@nestjs/common';
import { TaskscheduleService } from './taskschedule.service';
import { TaskscheduleController } from './taskschedule.controller';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [TaskscheduleController],
    providers: [TaskscheduleService],
})
export class TaskscheduleModule {}
