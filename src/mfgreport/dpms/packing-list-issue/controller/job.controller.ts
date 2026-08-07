import { Controller, Get, Param } from '@nestjs/common';
import { MarReportService } from '../job/mar-report.service';

@Controller('mfgreport/dpms/packing-list-issue/job')
export class JobController {
    constructor(private readonly marService: MarReportService) {}

    @Get('mar-report/1/')
    async marReport1() {
        return this.marService.sendMarReport(1);
    }

    @Get('mar-report/2')
    async marReport2() {
        return this.marService.sendMarReport(2);
    }

    @Get('mar-report/3')
    async marReport3() {
        return this.marService.sendMarReport(3);
    }

    @Get('mar-report/4')
    async marReport4() {
        return this.marService.sendMarReport(4);
    }

    @Get('mar-report/manual/:round/:date')
    async marReportManual(@Param('round') round: number, @Param('date') date: string) {
        return this.marService.sendMarReport(round, date);
    }
}
