import { Controller, Body, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AmeccalendarService } from './ameccalendar.service';

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
    addWorkDays(
        @Body() req: { startDate: number | string | Date; days: number },
    ) {
        return this.calendar.addWorkDays(req.startDate, req.days);
    }

    @Post('generate')
    generate(
        @Body() body: { year: string; startMonth: string; startId: string },
    ) {
        if (!body.year || !body.startMonth || !body.startId) {
            return {
                error: 'Missing required parameters: year, startMonth, startId',
            };
        }
        return this.calendar.generateYearlySchedule(
            +body.year,
            +body.startMonth,
            +body.startId,
        );
    }
}
