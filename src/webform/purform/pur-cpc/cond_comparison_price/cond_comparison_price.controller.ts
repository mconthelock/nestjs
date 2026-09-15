import { Controller, Get } from '@nestjs/common';
import { CondComparisonPriceService } from './cond_comparison_price.service';

@Controller('purform/cond-comparison-price')
export class CondComparisonPriceController {
    constructor(private readonly service: CondComparisonPriceService) {}

    @Get('active')
    getActive() {
        return this.service.getActive();
    }
}
