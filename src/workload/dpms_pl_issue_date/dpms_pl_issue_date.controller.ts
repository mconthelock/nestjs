import { Controller } from '@nestjs/common';
import { DpmsPlIssueDateService } from './dpms_pl_issue_date.service';

@Controller('dpms-pl-issue-date')
export class DpmsPlIssueDateController {
    constructor(private readonly service: DpmsPlIssueDateService) {}
}
