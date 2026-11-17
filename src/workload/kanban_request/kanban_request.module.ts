import { Module } from '@nestjs/common';
import { KanbanRequestService } from './kanban_request.service';
import { KanbanRequestController } from './kanban_request.controller';
import { KanbanRequestRepository } from './kanban_request.repository';
import { MailModule } from 'src/common/services/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psection } from 'src/common/Entities/amec/table/PSECTION.entity';
import { ISSUE_KANBAN } from 'src/common/Entities/workload/table/ISSUE_KANBAN.entity';
import { ISSUE_KANBAN_DETAIL } from 'src/common/Entities/workload/table/ISSUE_KANBAN_DETAIL.entity';

@Module({
    imports: [
        MailModule,
        TypeOrmModule.forFeature([Psection, ISSUE_KANBAN, ISSUE_KANBAN_DETAIL], 'mitsuConnection'),
    ],
    controllers: [KanbanRequestController],
    providers: [KanbanRequestService, KanbanRequestRepository],
})
export class KanbanRequestModule {}
