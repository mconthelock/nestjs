import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

import { SearchAttendanceDto } from './dto/search-attendance.dto';
@Controller('gpreport/attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Post('search')
    search(@Body() searchCriteria: SearchAttendanceDto) {
        return this.attendanceService.search(searchCriteria);
    }
}
