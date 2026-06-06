import { Controller } from '@nestjs/common';
import { DpmsPlIssueRevService } from './dpms_pl_issue_rev.service';
import { CreateDpmsPlIssueRevDto } from './dto/create-dpms_pl_issue_rev.dto';
import { UpdateDpmsPlIssueRevDto } from './dto/update-dpms_pl_issue_rev.dto';

@Controller('dpms-pl-issue-rev')
export class DpmsPlIssueRevController {
    constructor(private readonly service: DpmsPlIssueRevService) {}
}
