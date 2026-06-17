import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { PsRPService } from './ps-rp.service';
import { CreatePsrpReqFormDto, PsrReportDto } from './dto/create-ps-rp.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UpdateflowPSrpDto } from './dto/update-ps-rp.dto';

@Controller('psform/ps-rp')
export class PsRPController {
    constructor(private readonly psRpService: PsRPService) {}

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: CreatePsrpReqFormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.psRpService.create(dto, ip);
    }

    @Get('/list/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findList(
        @Param('fno', ParseIntPipe) fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno', ParseIntPipe) nrunno: number,
    ) {
        return this.psRpService.findList({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Post('/getReport')
    getReport(@Body() dto: PsrReportDto) {
        return this.psRpService.searchReport(dto);
    }

    @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findOne(
        @Param('fno', ParseIntPipe) fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno', ParseIntPipe) nrunno: number,
    ) {
        return this.psRpService.findOne({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Patch()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    update(@Body() dto: UpdateflowPSrpDto, @Req() req: Request) {
        const ip = getClientIP(req);

        return this.psRpService.doaction(dto, ip);
    }
}
