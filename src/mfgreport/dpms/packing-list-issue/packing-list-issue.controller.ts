import { Controller, Post, Body, Patch, Get, Param } from '@nestjs/common';
import { PackingListIssueService } from './packing-list-issue.service';
import { CreatePackingListIssueDto } from './dto/create-packing-list-issue.dto';
import {
    UpdatePackingListIssueDto,
    UpdatePlIssueProblemReasonDto,
} from './dto/update-packing-list-issue.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PackingListIssueProcedureService } from './packing-list-issue-procedure.service';

@Controller('mfgreport/dpms/packing-list-issue')
export class PackingListIssueController {
    constructor(
        private readonly service: PackingListIssueService,
        private readonly procedureService: PackingListIssueProcedureService,
    ) {}

    @Post()
    @UseTransaction('workloadConnection')
    issue(@Body() dto: CreatePackingListIssueDto) {
        return this.service.issue(dto);
    }

    @Patch('problem-reason')
    @UseTransaction('workloadConnection')
    updateProblemReason(@Body() dto: UpdatePlIssueProblemReasonDto) {
        return this.service.updateProblemReason(dto);
    }

    @Get('report/prod/:prod')
    getReportProdList(@Param('prod') prod: string) {
        return this.procedureService.getReportProdList(prod);
    }

    @Get('report/day/:day')
    getReportDayList(@Param('day') day: string) {
        return this.procedureService.getReportDayList(day);
    }
}
