import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ReportProdService } from './report_prod.service';
import { CreateReportProdDto } from './dto/create-report_prod.dto';
import { UpdateReportProdDto } from './dto/update-report_prod.dto';

@Controller('report-prod')
export class ReportProdController {
    constructor(private readonly reportProdService: ReportProdService) {}

    @Post('prod-history')
    getOutputProdHistory(
        @Body('startMonth') startMonth: string,
        @Body('endMonth') endMonth: string,
    ) {
        return this.reportProdService.getOutputProdHistory(
            startMonth,
            endMonth,
        );
    }

    @Post('finish-prod-history')
    getFinishProdHistory(
        @Body('startMonth') startMonth: string,
        @Body('endMonth') endMonth: string,
    ) {
        return this.reportProdService.getFinishProdHistory(
            startMonth,
            endMonth,
        );
    }

    @Post('count-finish-delay-history')
    getCountFinishDelayHistory(
        @Body('startMonth') startMonth: string,
        @Body('endMonth') endMonth: string,
    ) {
        return this.reportProdService.getCountFinishDelayHistory(
            startMonth,
            endMonth,
        );
    }
}
