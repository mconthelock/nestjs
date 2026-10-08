import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
    PriceComparisonListDto,
    PriceComparisonItemDetailDto,
} from './dto/price-comparison.dto';
import { CreateFormDto } from './dto/create-pcp-form.dto';

import { PurCpcService } from './services/purcpc_form.service';
import { CondComparisonPriceService } from './services/cond_comparison_price.service';

@Controller('purform/pur-cpc')
export class PurCpcController {
    constructor(
        private readonly service: PurCpcService,
        private readonly condComparisonPriceService: CondComparisonPriceService,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-24
     * @description รายการ functions
     * @returns
     */
    @Get('cond-comparison-price/active')
    getActive() {
        return this.condComparisonPriceService.getActive();
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-24
     * @description ดึงข้อมูลเพื่อนำไปให้ user เลือกรายการ master เพื่อนำไปหยอดลง excel file เพื่อให้ user กรอกข้อมูลรายการราคาสำหรับเปรียบเทียบ
     * @returns
     */
    @Post('planner-compare-sheet')
    async findPlannerCompareSheet(@Body() data: PriceComparisonPlannerDto) {
        return await this.service.findPlannerCompareSheet(data);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-24
     * @description ดึงข้อมูลเพื่อไปเปรียบเทียบราคาสินค้าหลังจาก user upload excel file มาแล้ว
     * @returns
     */
    @Post('Price-Comparison')
    async priceComparison(@Body() data: PriceComparisonDto) {
        return await this.service.getPriceComparison(data);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-29
     * @description สร้างฟอร์ม PUR-CPC ใหม่หรือแก้ไขฟอร์มที่มีอยู่แล้ว
     */
    @Post()
    @UseTransaction('webformConnection')
    async create(@Body() data: CreateFormDto) {
        return await this.service.create(data);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-29
     * @description ดึงข้อมูลรายการเปรียบเทียบราคาสินค้า
     * @returns
     */
    @Post('lists')
    async getLists(@Body() data: PriceComparisonListDto) {
        return await this.service.getLists(data);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-30
     * @description ดึงข้อมูลฟอร์ม PUR-CPC ตามหมายเลขฟอร์มที่ระบุ
     * @param form หมายเลขฟอร์ม PUR-CPC ที่ต้องการดึงข้อมูล
     * @returns
     */
    @Get('form/:form')
    async getForm(@Param('form') form: string) {
        return await this.service.getForm(form);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-08
     * @description ดึงข้อมูลรายละเอียด item จาก master ของแต่ละระบบ
     * @param data
     * @returns
     */
    @Post('item-detail')
    async findItemDetail(@Body() data: PriceComparisonItemDetailDto) {
        return await this.service.findItemDetail(data);
    }
}
