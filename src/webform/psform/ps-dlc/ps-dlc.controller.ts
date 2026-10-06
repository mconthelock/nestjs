import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { CreatePsdlcReqFormDto } from './dto/create-ps-dlc.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { PSDLCService } from './ps-dlc.service';
import { Request } from 'express';
import { PSDLCReportDto } from './dto/report-ps-dlc.dto';
import {
    UpdatedataPSDLCDto,
    UpdateflowPSDLCDto,
} from './dto/update-ps-dlc.dto';

@Controller('psform/ps-dlc')
export class PSDLCController {
    constructor(private readonly psdlcService: PSDLCService) {}

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: CreatePsdlcReqFormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.psdlcService.create(dto, ip);
    }

    @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findOne(
        @Param('fno') fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno') nrunno: number,
    ) {
        return this.psdlcService.findOne({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Post('/getReport')
    getReport(@Body() dto: PSDLCReportDto) {
        return this.psdlcService.searchReport(dto);
    }

    @Patch()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    update(@Body() dto: UpdateflowPSDLCDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.psdlcService.doaction(dto, ip);
    }

    @Patch('/updateForm')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    updateForm(@Body() dto: UpdatedataPSDLCDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.psdlcService.updateForm(dto, ip);
    }
}
