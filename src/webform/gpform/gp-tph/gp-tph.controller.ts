import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    Req,
    ParseIntPipe,
} from '@nestjs/common';
import { GpTphService } from './gp-tph.service';
import { CreateGpTphReqDto } from './dto/create-gp-tph.dto';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { CreateDataAreaDto } from './dto/create-data-area.dto';
import { updateDetailDto } from 'src/spprogram/inquiry-detail/dto/update.dto';
import { UpdateAreaDto } from './dto/update-data-area.dto';

@Controller('gpform/gp-tph')
export class GpTphController {
    constructor(private readonly gpTphService: GpTphService) { }

    @Get('areas')
    findAllAreas() {
        return this.gpTphService.findAllAreas();
    }

    @Get('locations')
    findAllLocations() {
        return this.gpTphService.findAllLocations();
    }

    @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findOne(
        @Param('fno') fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno') nrunno: number,
    ) {
        return this.gpTphService.findOne({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Get('/list/:fno/:orgno/:cyear/:cyear2/:nrunno')
    findList(
        @Param('fno', ParseIntPipe) fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno', ParseIntPipe) nrunno: number,
    ) {
        return this.gpTphService.findList({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(
        @Body() dto: CreateGpTphReqDto,
        @Req() req: Request,
    ) {
        console.log('CreateGpTphReqDto:', dto);
        const ip = getClientIP(req);
        return this.gpTphService.create(dto, ip);
    }

    @Post('areas')
    createArea(
        @Body() dto: CreateDataAreaDto,
    ) {
        console.log('CreateDataAreaDto:', dto);
        return this.gpTphService.createArea(dto);
    }

    @Patch('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor())
    update(
        @Param('fno', ParseIntPipe) fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno', ParseIntPipe) nrunno: number,
        @Body() dto: UpdateGpTphDto,
    ) {
        return this.gpTphService.update(
            { NFRMNO: fno, VORGNO: orgno, CYEAR: cyear, CYEAR2: cyear2, NRUNNO: nrunno },
            dto,
        );
    }

    @Delete('/:fno/:orgno/:cyear/:cyear2/:nrunno')
    @UseTransaction('webformConnection')
    delete(
        @Param('fno', ParseIntPipe) fno: number,
        @Param('orgno') orgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno', ParseIntPipe) nrunno: number,
    ) {
        return this.gpTphService.delete({
            NFRMNO: fno,
            VORGNO: orgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    @Patch('areas/:id')
    updateArea(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAreaDto,
    ) {
        return this.gpTphService.updateArea(id, dto);
    }

}

