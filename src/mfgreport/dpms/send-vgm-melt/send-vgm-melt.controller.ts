import { Controller, Get, Param, Query, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportExcelDto } from './dto/export-excel.dto';
import { SendVgmMeltService } from './service/send-vgm-melt.service';
import { ExportExcelService } from './service/export-excel.service';
import { sendExcel } from 'src/common/utils/exceljs';

@Controller('mfgreport/dpms/send-vgm-melt')
export class SendVgmMeltController {
    constructor(
        private readonly service: SendVgmMeltService,
        private readonly exportExcelService: ExportExcelService,
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
}
