import { Module } from '@nestjs/common';
import { KanbanRequestService } from './kanban_request.service';
import { KanbanRequestController } from './kanban_request.controller';
import { KanbanRequestRepository } from './kanban_request.repository';

@Module({
    controllers: [KanbanRequestController],
    providers: [KanbanRequestService, KanbanRequestRepository],
})
export class KanbanRequestModule {}
