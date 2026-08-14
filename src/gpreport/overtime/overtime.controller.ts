import { Controller, Post, Body, Param, Get } from '@nestjs/common';

import { OvertimeService } from './overtime.service';

import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@Controller('overtime')
export class OvertimeController {
    constructor(private readonly overtimeService: OvertimeService) {}

    @Get('request')
    async findRequest() {
        return await this.overtimeService.findRequest();
    }

    @Post('search')
    search(@Body() q: UpdateOvertimeDto) {
        return this.overtimeService.findAll(q);
    }

    @Post('searchot/:workdate')
    async getOtByWorkdate(@Param('workdate') workdate: string) {
        return await this.overtimeService.getOtByWorkdate(workdate);
    }
}
