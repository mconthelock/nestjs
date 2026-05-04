import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { StyPatrolInspectionService } from './sty-patrol-inspection.service';
import { CreateStyPatrolInspectionDto } from './dto/create-sty-patrol-inspection.dto';
import { UpdateStyPatrolInspectionDto } from './dto/update-sty-patrol-inspection.dto';
import { ReportStyPatrolInspectionDto } from './dto/report-sty-patrol-inspection.dto';

@Controller('gpreport/sty-patrol-inspection')
export class StyPatrolInspectionController {
    constructor(
        private readonly styPatrolInspectionService: StyPatrolInspectionService,
    ) {}

    @Get('listByMonth/:month/:year')
    listByMonth(@Param('month') month: string, @Param('year') year: string) {
        return this.styPatrolInspectionService.listByMonthYear(month, year);
    }

    @Post('itemsReport')
    getItemReport(@Body() dto: ReportStyPatrolInspectionDto) {
        return this.styPatrolInspectionService.getItemReport(dto);
    }
}
