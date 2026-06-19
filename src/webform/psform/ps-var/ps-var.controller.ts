import { Controller, Post, Body, Req } from '@nestjs/common';
import { PsVarService } from './ps-var.service';
import { getClientIP } from 'src/common/utils/ip.utils';
import { CreatePsVarDto } from './dto/create-ps-var.dto';

@Controller('ps-var')
export class PsVarController {
    constructor(private readonly psVarService: PsVarService) {}

    @Post('create')
    async create(@Body() data: CreatePsVarDto, @Req() req: any) {
        const ip = getClientIP(req);
        return this.psVarService.CreateForm(data, ip);
    }
}
