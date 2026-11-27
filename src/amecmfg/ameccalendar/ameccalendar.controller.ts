import {
    Controller,
    Body,
    Post,
    Get,
    Put,
    Delete,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { AmeccalendarService } from './ameccalendar.service';
import { GetProdDto } from './dto/GetProd.dto';
import { UpdateCalendarDayDto } from './dto/update-calendar-day.dto';
import { BulkUpdateCalendarDto } from './dto/bulk-update-calendar.dto';
import { CreateCalendarActivityDto } from './dto/create-calendar-activity.dto';
import { UpdateCalendarActivityDto } from './dto/update-calendar-activity.dto';

interface rangeObj {
    sdate: number;
    edate: number;
}

@ApiTags('Amec Calendar')
@Controller('calendar')
export class AmeccalendarController {
    constructor(private readonly calendar: AmeccalendarService) {}

    @Post('range')
    @ApiOperation({
        summary: 'Get AMEC Calendar by specify Start date and End date',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                sdate: { type: 'number', example: 20250101 },
                edate: { type: 'number', example: 20251231 },
            },
            required: ['sdate', 'edate'],
        },
    })
    getcalendarrange(@Body() req: rangeObj) {
        return this.calendar.listCalendar(req.sdate, req.edate);
    }

    @Post('addWorkDays')
    @ApiOperation({
        summary: 'Add Work Days',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                startDate: {
                    oneOf: [
                        { type: 'string', example: '2025-07-22' },
                        { type: 'number', example: 20250722 },
                    ],
                },
                days: { type: 'number', example: 3 },
            },
            required: ['startDate', 'days'],
            description: 'สามารถใส่เป็น date string, number หรือ Date ได้',
        },
    })
    addWorkDays(@Body() req: { startDate: number | string | Date; days: number }) {
        return this.calendar.addWorkDays(req.startDate, req.days);
    }

    @Post('generate')
    generate(@Body() body: { year: string; startMonth: string; startId: string }) {
        if (!body.year || !body.startMonth || !body.startId) {
            return {
                error: 'Missing required parameters: year, startMonth, startId',
            };
        }
        return this.calendar.generateYearlySchedule(+body.year, +body.startMonth, +body.startId);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-11-03
     * @description ดึงข้อมูลจุงการผลิตก่อนหน้า (Previous Production)
     * @param dto
     * @returns
     */
    @Post('previous-prod')
    getPreviousProd(@Body() dto: GetProdDto) {
        return this.calendar.getPreviousProd(dto);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-11-03
     * @description ดึงข้อมูลจุงการผลิตถัดไป (Next Production)
     * @param dto
     * @returns
     */
    @Post('next-prod')
    getNextProd(@Body() dto: GetProdDto) {
        return this.calendar.getNextProd(dto);
    }

    @Get('activities/:year')
    @ApiOperation({
        summary: 'Get company activities and holiday/working-saturday metadata by year',
    })
    @ApiParam({ name: 'year', example: 2026, description: '4-digit calendar year (AD)' })
    getActivitiesByYear(@Param('year', ParseIntPipe) year: number) {
        return this.calendar.getActivitiesByYear(year);
    }

    @Post('activities')
    @ApiOperation({
        summary: 'Create a company activity on a calendar date',
    })
    createActivity(@Body() dto: CreateCalendarActivityDto) {
        return this.calendar.createActivity(dto);
    }

    @Put('activities/:id')
    @ApiOperation({
        summary: 'Update an existing company activity by ID',
    })
    @ApiParam({ name: 'id', example: 1 })
    updateActivity(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCalendarActivityDto,
    ) {
        return this.calendar.updateActivity(id, dto);
    }

    @Delete('activities/:id')
    @ApiOperation({
        summary: 'Delete a company activity by ID',
    })
    @ApiParam({ name: 'id', example: 1 })
    deleteActivity(@Param('id', ParseIntPipe) id: number) {
        return this.calendar.deleteActivity(id);
    }

    @Post('bulk')
    @ApiOperation({
        summary: 'Bulk update calendar days or add company activities across multiple dates',
    })
    bulkUpdateCalendar(@Body() dto: BulkUpdateCalendarDto) {
        return this.calendar.bulkUpdateCalendar(dto);
    }

    @Put(':workId')
    @ApiOperation({
        summary: 'Update a single calendar day status (WORKDAY, HOLIDAY, WORKING_SATURDAY, WEEKEND)',
    })
    @ApiParam({ name: 'workId', example: 20260413, description: 'YYYYMMDD' })
    updateCalendarDay(
        @Param('workId', ParseIntPipe) workId: number,
        @Body() dto: UpdateCalendarDayDto,
    ) {
        return this.calendar.updateCalendarDay(workId, dto);
    }
}
