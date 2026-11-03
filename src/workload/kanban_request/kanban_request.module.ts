import { Module } from '@nestjs/common';
import { KanbanRequestService } from './kanban_request.service';
import { KanbanRequestController } from './kanban_request.controller';
import { KanbanRequestRepository } from './kanban_request.repository';
import { MailModule } from 'src/common/services/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psection } from 'src/common/Entities/amec/table/PSECTION.entity';

@Module({
    imports: [
        MailModule,
        TypeOrmModule.forFeature([Psection], 'mitsuConnection'),
    ],
    controllers: [KanbanRequestController],
    providers: [KanbanRequestService, KanbanRequestRepository],
})
export class KanbanRequestModule {}
