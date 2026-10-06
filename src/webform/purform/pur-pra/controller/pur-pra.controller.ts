import { Controller } from '@nestjs/common';
import { PurPraService } from '../services/pur-pra.service';
import { Get } from '@nestjs/common';

@Controller('purform/pur-pra')
export class PurPraController {
    constructor(private readonly service: PurPraService) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-05
     * @description ดึงข้อมูลคณะกรรมการทั้งหมด
     * @returns 
     */
    @Get('committees')
    getCommittees() {
        return this.service.getCommittees();
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-05
     * @description ดึงข้อมูลกลุ่มทั้งหมด
     * @returns 
     */
    @Get('groups')
    getGroups() {
        return this.service.getGroups();
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม COST_UP
     * @returns 
     */
    @Get('reasons/costup')
    getCostupReasons() {
        return this.service.getReasonsByGroup('COST_UP');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม COST_DOWN
     * @returns 
     */
    @Get('reasons/costdown')
    getCostdownReasons() {
        return this.service.getReasonsByGroup('COST_DOWN');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม BASIC_COND_REVISE
     * @returns 
     */
    @Get('reasons/condition-revise')
    getConditionReviseReasons() {
        return this.service.getReasonsByGroup('BASIC_COND_REVISE');
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม ESTIMATED_PRICE
     * @returns 
     */
    @Get('reasons/estimate-price')
    getEstimatePriceReasons() {
        return this.service.getReasonsByGroup('ESTIMATED_PRICE');
    }
}
