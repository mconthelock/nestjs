import { Controller, Get, Param } from '@nestjs/common';
import { AmecordersScheduleService } from './amecorders_schedule.service';

@Controller('workload/amecorders-schedule')
export class AmecordersScheduleController {
    constructor(
        private readonly amecordersScheduleService: AmecordersScheduleService,
    ) {}

    @Get('mfgbm-range/:jung')
    getMfgbmRange(@Param('jung') jung: string) {
        return this.amecordersScheduleService.getMfgbmRange(jung);
    }
}
