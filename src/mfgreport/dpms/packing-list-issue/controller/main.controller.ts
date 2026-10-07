import { Controller, Post, Body, Patch, Get, Param } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

import { ReviseShippingMarkDto } from '../dto/revise-shipping-mark.dto';
import { CreatePackingListIssueDto } from '../dto/create-packing-list-issue.dto';
import {
    UpdatePlIssueProblemReasonDto,
    GetDocForShowDto,
} from '../dto/update-packing-list-issue.dto';
import { ProcedureService } from '../services/procedure.service';
import { SearchDpmsPlIssueDto } from 'src/workload/dpms_pl_issue/dto/search-dpms_pl_issue.dto';

import { PackingListIssueService } from '../packing-list-issue.service';
import { IssueService } from '../services/issue.service';
import { ReviseShippingMarkService } from '../services/revise-shipping-mark.service';

@Controller('mfgreport/dpms/packing-list-issue')
export class MainController {
    constructor(
        private readonly service: PackingListIssueService,
        private readonly createService: IssueService,
        private readonly procedureService: ProcedureService,
        private readonly reviseShippingMarkService: ReviseShippingMarkService,
    ) {}

    @Post()
    @UseTransaction('workloadConnection')
    issue(@Body() dto: CreatePackingListIssueDto) {
        return this.createService.issue(dto);
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

    @Get('shoporder/:ordermain')
    getShopOrder(@Param('ordermain') ordermain: string) {
        return this.procedureService.getShopOrder(ordermain);
    }

    @Post('last-rev-document')
    getLastRevDocument(@Body() dto: SearchDpmsPlIssueDto) {
        return this.procedureService.getLastRevDocument(dto);
    }

    @Post('doc-for-show')
    getDocforShow(@Body() dto: GetDocForShowDto) {
        return this.procedureService.getDocforShow(dto);
    }

    @Post('shippingMark-revise')
    @UseTransaction('workloadConnection')
    reviseShippingMark(@Body() dto: ReviseShippingMarkDto) {
        return this.reviseShippingMarkService.reviseShippingMark(dto);
    }
}
