import { Controller, Post, Body, Req, Get, Patch } from '@nestjs/common';
import { IsSefService } from './is-sef.service';
import { CreateIsSefDto } from './dto/create-is-sef.dto';
import { UpdateIsSefDto } from './dto/update-is-sef.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { CreateIsSefEmptyDto } from './dto/create-is-sef-empty.dto';

@Controller('is-sef')
export class IsSefController {
    constructor(private readonly isSefService: IsSefService) {}

    @Post('insertForm')
    insertForm(@Body() createIsSefDto: CreateIsSefDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.isSefService.insertForm(createIsSefDto, ip);
    }

    @Post('insertEmptyForm')
    insertEmptyForm(
        @Body() createIsSefEmptyDto: CreateIsSefEmptyDto,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.isSefService.insertEmptyForm(createIsSefEmptyDto, ip);
    }

    @Post('getSessionByForm')
    findSessionByForm(
        @Body()
        form: {
            NFRMNO: number;
            VORGNO: string;
            CYEAR: string;
            CYEAR2: string;
            NRUNNO: number;
        },
    ) {
        return this.isSefService.findSessionByForm(form);
    }

    @Get('getCriteria')
    getCriteria() {
        return this.isSefService.getCriteria();
    }

    @Post('getWorkPlan')
    getWorkPlan(@Body() filter?: Partial<Record<string, any>>) {
        return this.isSefService.getWorkPlan(filter);
    }

    @Patch('update')
    update(@Body() updateIsSefDto: UpdateIsSefDto) {
        return this.isSefService.update(updateIsSefDto);
    }
}
