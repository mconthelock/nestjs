import { Controller, Get, Param } from '@nestjs/common';
import { MarReportService } from '../services/mar-report.service';
import { ReviseVgmService } from '../services/revise-vgm.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('mfgreport/dpms/packing-list-issue/job')
export class JobController {
    constructor(private readonly marService: MarReportService,
        private readonly reviseVgmService: ReviseVgmService
    ) {}

    // สำหรับ run job แบบอัตโนมัติ ช่วงเวลา 15:00-08:00
    @Get('mar-report/1/')
    @UseTransaction('workloadConnection')
    async marReport1() {
        return this.marService.sendMarReport(1);
    }

    // สำหรับ run job แบบอัตโนมัติ ช่วงเวลา 08:00-10:00
    @Get('mar-report/2')
    @UseTransaction('workloadConnection')
    async marReport2() {
        return this.marService.sendMarReport(2);
    }

    // สำหรับ run job แบบอัตโนมัติ ช่วงเวลา 10:00-12:00
    @Get('mar-report/3')
    @UseTransaction('workloadConnection')
    async marReport3() {
        return this.marService.sendMarReport(3);
    }

    // สำหรับ run job แบบอัตโนมัติ ช่วงเวลา 12:00-15:00
    @Get('mar-report/4')
    @UseTransaction('workloadConnection')
    async marReport4() {
        return this.marService.sendMarReport(4);
    }

    // สำหรับ Admin ใช้สรัน job แบบ manual โดยเลือก round และ date ที่ต้องการ
    @Get('mar-report/manual/:round/:date')
    @UseTransaction('workloadConnection')
    async marReportManual(@Param('round') round: number, @Param('date') date: string) {
        return this.marService.sendMarReport(round, date);
    }

    // สำหรับ run job แบบอัตโนมัติ โดยไม่ต้องส่ง vanndate เข้ามา
    @Get('revise-vgm')
    @UseTransaction('workloadConnection')
    async reviseVgm() {
        return this.reviseVgmService.reviseVgm();
    }

    // สำหรับ Admin ใช้สรัน job แบบ manual โดยเลือกวัน vanndate ที่ต้องการ
    @Get('revise-vgm/manual/:vanndate')
    @UseTransaction('workloadConnection')
    async reviseVgmManual(@Param('vanndate') vanndate: string) {
        return this.reviseVgmService.reviseVgm(vanndate);
    }
}
