import { Controller, Get, Param, Query, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportExcelDto } from './dto/export-excel.dto';
import { SendVgmMeltService } from './service/send-vgm-melt.service';
import { ExportExcelService } from './service/export-excel.service';
import { sendExcel } from 'src/common/utils/exceljs';
import { SendMailManualService } from './service/send-mail-manual.service';
import { SendMailManualDto } from './dto/send-mail-manual.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { JobService } from './service/job.service';

@Controller('mfgreport/dpms/send-vgm-melt')
export class SendVgmMeltController {
    constructor(
        private readonly service: SendVgmMeltService,
        private readonly exportExcelService: ExportExcelService,
        private readonly manualService: SendMailManualService,
        private readonly jobService: JobService,
    ) {}

    @Get('list')
    async getList(@Query('vanndate') vanndate: string) {
        return await this.service.getList(vanndate);
    }

    @Post('export-excel')
    async exportExcel(@Body() dto: ExportExcelDto, @Res() res: Response) {
        const { buffer, filename } =
            await this.exportExcelService.exportExcel(dto);
        sendExcel(res, buffer, filename);
    }

    @Get('manual/:vanndate')
    async manual(@Param('vanndate') vanndate: string) {
        return await this.jobService.job(vanndate);
    }

    @Get('job')
    async job(){
        return await this.jobService.job();
    }

    @Post('send-mail')
    @UseTransaction('workloadConnection')
    async sendMail(@Body() dto: SendMailManualDto) {
        return await this.manualService.sendManualByUser(dto);
    }
}
