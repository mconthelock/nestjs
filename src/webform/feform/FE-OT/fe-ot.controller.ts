import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { UseForceTransaction, UseTransaction } from 'src/common/decorator/transaction.decorator';
import { CreatefeotDetails } from './dto/create-fe-ot.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { FEOTService } from './fe-ot.service';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UpdatefeotDto } from './dto/update-fe-ot.dto';

@Controller('feform/fe-ot')
export class FEOTController {
    constructor(private readonly feotService: FEOTService) {}

    @Post()
    @UseTransaction('mitsuConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: CreatefeotDetails, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.feotService.create(dto, ip);
    }

    @Get('/:planyear/:planmonth/:sempno')
    getDataOT(
        @Param('planyear') planyear: number,
        @Param('planmonth') planmonth: number,
        @Param('sempno') sempno: string,
    ) {
        return this.feotService.getDataOT({
            PLANYEAR: planyear,
            PLANMONTH: planmonth,
            SEMPNO: sempno,
        });
    }

    @Get()
    getDataOTall() {
        return this.feotService.getDataOTall();
    }

    @Delete('/:planyear/:planmonth/:sempno/:wdate')
    remove(
        @Param('planyear', ParseIntPipe) planyear: number,
        @Param('planmonth', ParseIntPipe) planmonth: number,
        @Param('sempno') sempno: string,
        @Param('wdate') wdate: string,
    ) {
        return this.feotService.remove({
            PLANYEAR: planyear,
            PLANMONTH: planmonth,
            SEMPNO: sempno,
            WORKDATE: wdate,
        });
    }

    @Patch('/update')
    @UseTransaction('mitsuConnection')
    @UseForceTransaction()
    update(@Body() dto: UpdatefeotDto, @Req() req: Request) {
        return this.feotService.update(dto, getClientIP(req));
    }
}
