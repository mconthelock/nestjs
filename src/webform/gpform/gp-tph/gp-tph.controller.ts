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
} from '@nestjs/common';
import { GpTphService } from './gp-tph.service';
import { CreateGpTphReqDto } from './dto/create-gp-tph.dto';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('gpform/gp-tph')
export class GpTphController {
    constructor(private readonly gpTphService: GpTphService) {}

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
}


