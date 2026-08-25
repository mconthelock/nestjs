import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { LeaveService } from './leave.service';

import { SearchLeaveDto } from './dto/search-leave.dto';
import { SearchActualLeaveDto } from './dto/lr100p.dto';

@Controller('gpreport/leave')
export class LeaveController {
    constructor(private readonly leave: LeaveService) {}

    @Post('search')
    search(@Body() dto: SearchLeaveDto) {
        return this.leave.search(dto);
    }

    @Post('actual')
    findActual(@Body() dto: SearchActualLeaveDto) {
        return this.leave.findActual(dto);
    }
}
