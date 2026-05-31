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
import { FormDto } from 'src/webform/center/form/dto/form.dto';

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

    @Post('listByForm')
    listByForm(@Body() dto: FormDto) {
        return this.styPatrolInspectionService.listByForm(dto);
    }

    @Get('draft/:empno')
    findDraft(@Param('empno') empno: string) {
        return this.styPatrolInspectionService.findDraft(empno);
    }

    @Get('summary/class/:fyear')
    summaryClass(@Param('fyear') fyear: string) {
        return this.styPatrolInspectionService.summaryClass(fyear);
    }

    @Get('summary/class/section/:fyear/:seccode')
    summaryClassBySec(
        @Param('fyear') fyear: string,
        @Param('seccode') seccode: string,
    ) {
        return this.styPatrolInspectionService.summaryClass(fyear, seccode);
    }

    @Get('summary/item/:fyear/:month/:class')
    summaryItem(
        @Param('fyear') fyear: string,
        @Param('month') month: string,
        @Param('class') className: string,
    ) {
        return this.styPatrolInspectionService.summaryItem(
            fyear,
            +month,
            className,
        );
    }

    @Get('summary/item/section/:fyear/:month/:sseccode')
    summaryItemBySec(
        @Param('fyear') fyear: string,
        @Param('month') month: string,
        @Param('sseccode') sseccode: string,
    ) {
        return this.styPatrolInspectionService.summaryItemBySec(
            fyear,
            +month,
            sseccode,
        );
    }

    @Get('summary/item/section/class/:fyear/:month/:class/:sseccode')
    summaryItemClassBySec(
        @Param('fyear') fyear: string,
        @Param('month') month: string,
        @Param('class') className: string,
        @Param('sseccode') sseccode: string,
    ) {
        return this.styPatrolInspectionService.summaryItem(
            fyear,
            +month,
            className,
            sseccode,
        );
    }

    @Get('summary/section/:fyear/:month/:deptcode')
    summarySection(
        @Param('fyear') fyear: string,
        @Param('month') month: string,
        @Param('deptcode') deptcode: string,
    ) {
        return this.styPatrolInspectionService.summarySection(
            fyear,
            +month,
            deptcode,
        );
    }

    @Get('summary/department/:fyear/:month')
    summaryDepartment(
        @Param('fyear') fyear: string,
        @Param('month') month: string,
    ) {
        return this.styPatrolInspectionService.summaryDepartment(fyear, +month);
    }
}
