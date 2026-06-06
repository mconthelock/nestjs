import { Controller } from '@nestjs/common';
import { DpmsPlIssueService } from './dpms_pl_issue.service';

@Controller('dpms-pl-issue')
export class DpmsPlIssueController {
    constructor(private readonly service: DpmsPlIssueService) {}
}
