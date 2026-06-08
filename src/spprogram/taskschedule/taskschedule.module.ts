import { Module } from '@nestjs/common';
import { TaskscheduleService } from './taskschedule.service';
import { TaskscheduleController } from './taskschedule.controller';
import { MailModule } from 'src/common/services/mail/mail.module';
import { InquiryModule } from '../inquiry/inquiry.module';
import { PrebmModule } from '../prebm/prebm.module';
import { TimelineModule } from '../timeline/timeline.module';

@Module({
    imports: [MailModule, InquiryModule, PrebmModule, TimelineModule],
    controllers: [TaskscheduleController],
    providers: [TaskscheduleService],
})
export class TaskscheduleModule {}
