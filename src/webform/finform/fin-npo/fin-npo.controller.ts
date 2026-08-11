import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import {
    ActionFinnpoDto,
    CreateFinnpoDto,
    FinnpoReportFilterDto,
    FinnpoService,
} from './fin-npo.service';

@Controller('finform/fin-npo')
export class FinnpoController {
    constructor(private readonly finnpoService: FinnpoService) {}

    @Get()
    findAll() {
        return this.finnpoService.findAll();
    }

    @Get('expense')
    findAllExpenseForShow() {
        return this.finnpoService.findAllExpenseForShow();
    }

    @Get('vendor')
    findAllVendorForShow() {
        return this.finnpoService.findAllVendorForShow();
    }

    @Get('currency')
    findAllCurrencyForShow() {
        return this.finnpoService.findAllCurrencyForShow();
    }

    @Get('costcenter')
    findAllCostCenterForShow() {
        return this.finnpoService.findAllCostCenterForShow();
    }

    @Post('report')
    findReport(@Body() dto: FinnpoReportFilterDto) {
        return this.finnpoService.findReport(dto);
    }

    @Get('show/:nfrmno/:vorgno/:cyear/:cyear2/:nrunno')
    findOneForShow(
        @Param('nfrmno') nfrmno: string,
        @Param('vorgno') vorgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno') nrunno: string,
    ) {
        return this.finnpoService.findOneForShow(
            Number(nfrmno),
            vorgno,
            cyear,
            cyear2,
            Number(nrunno),
        );
    }

    @Post()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    create(@Body() dto: CreateFinnpoDto, @Req() req: Request) {
        return this.finnpoService.create(dto, getClientIP(req));
    }

    @Post('action')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    action(@Body() dto: ActionFinnpoDto, @Req() req: Request) {
        return this.finnpoService.action(dto, getClientIP(req));
    }
}
