import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CheckinventoryService } from './checkinventory.service';
import { CreateCheckinventoryDto } from './dto/create-checkinventory.dto';
import { UpdateYearlyDto } from './dto/update-yearly.dto';
import { CreateYearlyFormDto } from './dto/create-yearlyform.dto';
import { getClientIP } from 'src/common/utils/ip.utils';

@Controller('checkinventory')
export class CheckinventoryController {
    constructor(private readonly cs: CheckinventoryService) {}

    @Get('getReport')
    getReport() {
        return this.cs.getReport();
    }

    @Post('getReportAssign')
    getReportAssign(@Body() body: { REPORT_ID: number }) {
        return this.cs.getReportAssign(body.REPORT_ID);
    }

    @Post('createReport')
    createReport(
        @Body()
        body: {
            empno: string;
            periods: string;
            formData: {
                NFRMNO: number;
                VORGNO: string;
                CYEAR: string;
                CYEAR2: string;
                NRUNNO: number;
            };
        },
    ) {
        return this.cs.createReportWithForm(
            body.empno,
            body.periods,
            body.formData,
        );
    }

    @Post('createYearlyReport')
    createYearlyReport(
        @Body() body: { YEAR: string; PERIOD: string; EMPNO: string },
    ) {
        return this.cs.createYearlyReport(body.YEAR, body.PERIOD, body.EMPNO);
    }

    @Patch('updateYearlyReport')
    updateYearlyReport(@Body() body: UpdateYearlyDto) {
        return this.cs.updateYearlyReport(body);
    }

    @Post('checkAllActualChecked')
    checkAllActualChecked(@Body() body: { reportID: number }) {
        return this.cs.checkAllActualChecked(body.reportID);
    }

    @Post('insertYearlyForm')
    insertYearlyForm(@Body() body: CreateYearlyFormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.cs.insertYearlyForm(body, ip);
    }

    @Post('getYearlyResult')
    getYearlyResult(@Body() body: { reportID: number }) {
        return this.cs.getYearlyResult(body.reportID);
    }
}
