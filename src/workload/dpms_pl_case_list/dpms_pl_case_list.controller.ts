import { Controller, Get, Param } from '@nestjs/common';
import { DpmsPlCaseListService } from './dpms_pl_case_list.service';

@Controller('workload/dpms-pl-case-list')
export class DpmsPlCaseListController {
    constructor(private readonly service: DpmsPlCaseListService) {}

    @Get(':id')
    findByRevId(@Param('id') id: string) {
        return this.service.findByRevId(+id);
    }

    @Get('partial-selection/:id')
    findPartialSelectionByRevId(@Param('id') id: string) {
        return this.service.findPartialSelectionByRevId(+id);
    }
}
