import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CheckinventoryService } from './checkinventory.service';
import { CreateCheckinventoryDto } from './dto/create-checkinventory.dto';
import { UpdateCheckinventoryDto } from './dto/update-checkinventory.dto';

@Controller('checkinventory')
export class CheckinventoryController {
    constructor(private readonly cs: CheckinventoryService) {}

    @Get('getReport')
    getReport() {
        return this.cs.getReport();
    }

    @Post('getReportAssign')
    getReportAssign(@Body() body: { REPORT_ID: number }) {
        return this.cs.getReportAssign(body.REPORT_ID);
    }
}
