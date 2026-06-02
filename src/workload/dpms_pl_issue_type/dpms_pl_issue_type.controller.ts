import { Controller, Get } from '@nestjs/common';
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
}
