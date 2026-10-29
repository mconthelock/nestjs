import { Controller, Get, Param } from '@nestjs/common';
import { FollowService } from '../services/follow.service';

@Controller('safety/follow')
export class FollowController {
    constructor(private readonly service: FollowService) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-28
     * @description ดึงข้อมูล form ตามปีงบประมาณ (fyear) เพื่อนำไปแสดงหน้าติดตามฟอร์มของสารเคมี
     * @param fyear
     * @returns ข้อมูลฟอร์มตามปีงบประมาณ (fyear)
     */
    @Get('fyear/:fyear')
    getByFyear(@Param('fyear') fyear: string) {
        return this.service.getByFyear(fyear);
    }
}
