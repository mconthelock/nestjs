import { Controller, Get, Param } from '@nestjs/common';
import { DpmsPlIssueTypeService } from './dpms_pl_issue_type.service';

@Controller('workload/dpms-pl-issue-type')
export class DpmsPlIssueTypeController {
    constructor(
        private readonly dpmsPlIssueTypeService: DpmsPlIssueTypeService,
    ) {}

    @Get()
    findAll() {
        return this.dpmsPlIssueTypeService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.dpmsPlIssueTypeService.findById(+id);
    }
}
