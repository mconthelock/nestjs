import { Controller, Post, Body, Req } from '@nestjs/common';
import { PsVarService } from './ps-var.service';
import { getClientIP } from 'src/common/utils/ip.utils';
import { CreatePsVarDto } from './dto/create-ps-var.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('ps-var')
export class PsVarController {
    constructor(private readonly psVarService: PsVarService) {}

    @Post('create')
    async create(@Body() data: CreatePsVarDto, @Req() req: any) {
        const ip = getClientIP(req);
        return this.psVarService.CreateForm(data, ip);
    }

    @Post('getDataResult')
    async getDataResult(@Body('reportID') reportID: number) {
        return this.psVarService.getDataResult(reportID);
    }

    @Post('getDataResult2')
    async getDataResult2(@Body() dto: FormDto) {
        return this.psVarService.getDataResult2(dto);
    }
}
