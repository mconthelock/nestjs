import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { PsUpiService } from './ps-upi.service';
import { CreatePsUpiDto } from './dto/create-ps-upi.dto';
import { UpdatePsUpiDto } from './dto/update-ps-upi.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { SearchReportDto } from './dto/search-report.dto';

@Controller('ps-upi')
export class PsUpiController {
    constructor(private readonly psUpiService: PsUpiService) {}

    @Get('reason')
    getReason() {
        return this.psUpiService.getReason();
    }

    @Post('submit')
    @UseTransaction('webformConnection')
    submit(@Body() createPsUpiDto: CreatePsUpiDto, @Req() req: any) {
        const ip = getClientIP(req);
        return this.psUpiService.submit(createPsUpiDto, ip);
    }

    @Post('getDataForm')
    getDataForm(@Body() dto: FormDto) {
        return this.psUpiService.getDataForm(dto);
    }

    @Post('getReport')
    getReport(@Body() dto: SearchReportDto) {
        return this.psUpiService.getReport(dto);
    }
}
