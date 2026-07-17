import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { CreatePsClmReqFormDto } from './dto/create-ps-clm.dto';
import { UpdatePsClmDto } from './dto/update-ps-clm.dto';
import { PsClmService } from './ps-clm.service';

@Controller('psform/ps-clm')
export class PsClmController {
    constructor(private readonly psClmService: PsClmService) {}

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: CreatePsClmReqFormDto, @Req() req: Request) {
        return this.psClmService.create(dto, getClientIP(req));
    }

    @Patch()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    update(@Body() dto: UpdatePsClmDto, @Req() req: Request) {
        return this.psClmService.update(dto, getClientIP(req));
    }

    @Get('report')
    findReport(@Query() filters: Record<string, string>) {
        return this.psClmService.findReport(null, filters);
    }

    @Get('report/:year')
    findReportByYear(
        @Param('year') year: string,
        @Query() filters: Record<string, string>,
    ) {
        return this.psClmService.findReport(year, filters);
    }

    @Get('next-order')
    nextOrder(@Query('orderNo') orderNo: string) {
        return this.psClmService.nextOrder(orderNo);
    }

    @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findOne(
        @Param('fno', ParseIntPipe) fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno', ParseIntPipe) nrunno: number,
    ) {
        return this.psClmService.findOne({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }
}
