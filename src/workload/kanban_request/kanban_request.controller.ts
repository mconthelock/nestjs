import { Body, Controller, Get, Post } from '@nestjs/common';
import { KanbanRequestService } from './kanban_request.service';
import { CreateKanbanRequestDto } from './dto/create-kanban_request.dto';

@Controller('kanban-request')
export class KanbanRequestController {
    constructor(private readonly kanbanRequestService: KanbanRequestService) {}

    @Get('getPKC_Product')
    async getPKC_Product() {
        const data = await this.kanbanRequestService.getPKC_Product();
        return data;
    }

    @Post('getProdGroup')
    async getProdGroup(@Body('itemcode') itemcode: string) {
        const data = await this.kanbanRequestService.getProdGroup(itemcode);
        return data;
    }

    @Post('insertIssueKanban')
    async insertIssueKanban(@Body() dto: CreateKanbanRequestDto) {
        // Implement the logic to insert issue kanban here
        // For now, just return the received body for demonstration
        const data = await this.kanbanRequestService.insertIssueKanban(dto);
        // return { message: 'Insert Issue Kanban functionality is implemented.', receivedData: dto };
    }
}
