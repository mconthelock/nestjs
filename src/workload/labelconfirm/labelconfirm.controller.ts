import { Controller, Get, Body, Post } from '@nestjs/common';
import { LabelconfirmService } from './labelconfirm.service';
import { CreateLabelconfirmDto } from './dto/create-labelconfirm.dto';
import { UpdateLabelconfirmDto } from './dto/update-labelconfirm.dto';
import { InsertErrLogDto } from './dto/insert-err_log.dto';

@Controller('labelconfirm')
export class LabelconfirmController {
    constructor(private readonly ls: LabelconfirmService) {}

    @Post('label-list')
    async getLabelList(
        @Body('order') order: string,
        @Body('packing') packing: string,
    ) {
        return this.ls.getLabelList(order, packing);
    }

    @Post('confirm')
    async confirm(
        @Body('qr_code') qrCode: string,
        @Body('empno') empno: string,
    ) {
        return this.ls.confirm(qrCode, empno);
    }

    @Post('err_log')
    async errLog(@Body() dto: InsertErrLogDto) {
        return this.ls.errLog(dto);
    }

    @Get('kitting-label-history')
    async getKittingLabelHistory() {
        return this.ls.getKittingLabelHistory();
    }
}
