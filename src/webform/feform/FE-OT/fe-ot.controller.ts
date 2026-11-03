import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { CreatefeotDetails } from './dto/create-fe-ot.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { FEOTService } from './fe-ot.service';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('feform/fe-ot')
export class FEOTController {
    constructor(private readonly feotService: FEOTService) {}

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: CreatefeotDetails, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.feotService.create(dto, ip);
    }

    @Get()
    getDataOT(){
        return this.feotService.getDataOT();
    }
}
