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
        const head = await this.kanbanRequestRepository.insertIssueKanban([
            {
                REQ_SECTION,
                REQ_BY: EMPNO,
                STATUS,
                PRODUCT_CAT: dto.PRODUCT_CAT,
            },
        ]);

        const detailRecords = DETAIL.map((item) => ({
            IK_ID: head,
            ITEM_CODE: item.ITEM_CODE,
            QTY_REQ: item.QTY_REQ,
            QTY_PR: item.QTY_REQ,
            REMARK: item.REMARK,
        }));
        await this.kanbanRequestRepository.insertIssueKanbanDetail(
            detailRecords,
        );
        // Implement the logic to insert issue kanban here
        // For now, just return the received data for demonstration
        // return { message: 'Insert Issue Kanban functionality is not implemented yet.', receivedData: dto };
    }
}
