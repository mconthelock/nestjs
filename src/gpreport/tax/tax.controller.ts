import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { TaxService } from './tax.service';

import { CreateTaxDto } from './dto/create-tax.dto';
import { SearchTaxDto } from './dto/search-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { ApproveTaxDto } from './dto/approve-tax.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';

@ApiTags('Gpreport - Tax Deduction (GP-LY01)')
@Controller('gpreport/tax')
export class TaxController {
    constructor(private readonly taxService: TaxService) {}

    @Get('items')
    @ApiOperation({
        summary: 'ดึงโครงสร้างเกณฑ์ค่าลดหย่อนภาษีเงินได้ 18 รายการ (Master Items)',
    })
    getTaxItems() {
        return this.taxService.getTaxItems();
    }

    @Get('current/:empno')
    @ApiOperation({
        summary: 'ดึงข้อมูลสิทธิ์และค่าลดหย่อนภาษีปัจจุบันของพนักงาน (จากระบบ AS400)',
    })
    @ApiParam({ name: 'empno', description: 'รหัสพนักงาน' })
    findCurrentTax(@Param('empno') empno: string) {
        return this.taxService.findCurrentTax(empno);
    }

    @Post('history')
    @ApiOperation({
        summary: 'ดึงประวัติการยื่นแบบคำขอลดหย่อนภาษีทั้งหมดของพนักงาน',
    })
    @ApiParam({ name: 'empno', description: 'รหัสพนักงาน' })
    findHistory(@Body() body: SearchTaxDto) {
        return this.taxService.findHistory(body);
    }

    @Post('create')
    @ApiOperation({
        summary: 'บันทึกแบบร่าง (action=0) หรือยื่นคำขอลดหย่อนภาษี (action=1)',
    })
    @UseTransaction('mitsuConnection')
    saveTaxRequest(@Body() createTaxDto: CreateTaxDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.taxService.create(createTaxDto, ip);
    }
}
