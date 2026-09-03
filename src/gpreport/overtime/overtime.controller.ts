import { Controller, Post, Body, Param, Get } from '@nestjs/common';

import { OvertimeService } from './overtime.service';
import { SearchOvertimeDto } from './dto/search-overtime.dto';
import { SearchActualOvertimeDto } from './dto/lr200p.dto';

@Controller('overtime')
export class OvertimeController {
    constructor(private readonly overtimeService: OvertimeService) {}

    @Post('search')
    search(@Body() q: SearchOvertimeDto) {
        return this.overtimeService.findAll(q);
    }

    @Post('actual')
    searchActual(@Body() q: SearchActualOvertimeDto) {
        return this.overtimeService.findActual(q);
    }

    @Post('searchot/:workdate')
    async getOtByWorkdate(@Param('workdate') workdate: string) {
        return await this.overtimeService.getOtByWorkdate(workdate);
    }
}
