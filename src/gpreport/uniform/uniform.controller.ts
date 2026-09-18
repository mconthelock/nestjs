import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Delete,
    Req,
} from '@nestjs/common';
import { UniformService } from './uniform.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

import { CreateCalendarDto } from './dto/create-calendar.dto';
import { CreateAnnualDto } from './dto/create-annual.dto';

@Controller('gpreport/uniform')
export class UniformController {
    constructor(private readonly uniform: UniformService) {}

    @Get('calendar')
    findCalendar() {
        return this.uniform.findCalendar();
    }

    @Post('calendar')
    upsertCalendar(@Body() data: CreateCalendarDto) {
        return this.uniform.upsertCalendar(data);
    }

    @Delete('calendar/:year')
    deleteCalendar(@Param('year') year: number) {
        return this.uniform.deleteCalendar(year);
    }

    @Get('master')
    findAll() {
        return this.uniform.findAll();
    }

    @Get('rights')
    findRights() {
        return this.uniform.findRights();
    }

    @Get('annual/request/:year')
    findRightsByYear(@Param('year') year: number) {
        return this.uniform.findAnnualRequestYear(+year);
    }

    @Get('annual/request/:userId/:year')
    findRightsByUserId(
        @Param('userId') userId: string,
        @Param('year') year: number,
    ) {
        return this.uniform.findAnnualRequest(userId, +year);
    }

    @Post('annual/request/')
    @UseTransaction('gpreportConnection')
    createRequest(@Body() data: CreateAnnualDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.uniform.createAnnualRequest(data, ip);
    }

    @Delete('annual/request/:userId/:year')
    @UseTransaction('gpreportConnection')
    deleteRequest(
        @Param('userId') userId: string,
        @Param('year') year: number,
    ) {
        return this.uniform.deleteRequest(userId, +year);
    }

    @Delete('annual/request/:userId/:year/paid')
    @UseTransaction('gpreportConnection')
    deletePaidRequest(
        @Param('userId') userId: string,
        @Param('year') year: number,
    ) {
        return this.uniform.deleteRequestDetail(userId, +year);
    }
}
