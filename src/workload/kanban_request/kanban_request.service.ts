import { Injectable } from '@nestjs/common';
import { KanbanRequestRepository } from './kanban_request.repository';
import { CreateKanbanRequestDto } from './dto/create-kanban_request.dto';

@Injectable()
export class KanbanRequestService {
    constructor(
        private readonly kanbanRequestRepository: KanbanRequestRepository,
    ) {}

    async getPKC_Product() {
        return this.kanbanRequestRepository.getPKC_Product();
    }

    async getProdGroup(itemcode: string) {
        return this.kanbanRequestRepository.getProdGroup(itemcode);
    }

    async insertIssueKanban(dto: CreateKanbanRequestDto) {
        const { EMPNO, REQ_SECTION, STATUS, DETAIL } = dto;
        const data_head = '';
        // Implement the logic to insert issue kanban here
        // For now, just return the received data for demonstration
        // return { message: 'Insert Issue Kanban functionality is not implemented yet.', receivedData: dto };
    }
}
