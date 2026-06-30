import { Body, Controller, Post } from '@nestjs/common';
import { DpmsPlLastRevisionViewService } from './dpms_pl_last_revision_view.service';
import { SearchDpmsPlIssueDto } from '../dpms_pl_issue/dto/search-dpms_pl_issue.dto';

@Controller('workload/dpms-pl-last-revision-view')
export class DpmsPlLastRevisionViewController {
    constructor(private readonly service: DpmsPlLastRevisionViewService) {}

    @Post('get-last-revision')
    getLastRevision(@Body() dto: SearchDpmsPlIssueDto) {
        return this.service.getLastRevision(dto);
    }
}
