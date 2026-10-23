import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Get,
    Req,
} from '@nestjs/common';
import { IeTsService } from './ie-ts.service';
import { CreateIetsDto } from './dto/create-ie-ts.dto';
import { UpdateIetsDto } from './dto/update-ie-ts.dto';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { RequestIetsDto } from './dto/request-ie-ts.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
@Controller('ieform/ie-ts')
export class IeTsController {
    constructor(private readonly ieTsservice: IeTsService) {}

    private readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/IE/IETS/` as string;

    @Post('create')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    create(@Body() dto: RequestIetsDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.ieTsservice.request(dto, ip);
    }

    @Get('orgmfg')
    getorbmfg() {
        return this.ieTsservice.getOrgMfg();
    }

    @Get()
    findAll() {
        return this.ieTsservice.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ieTsservice.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateIeTDto: UpdateIetsDto) {
        return this.ieTsservice.update(+id, updateIeTDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ieTsservice.remove(+id);
    }
}
