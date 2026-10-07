import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { DpmsCountryConditionService } from './dpms_country_condition.service';
import { CreateCountryConditionDto, DeleteCountryConditionDto } from './dto/dpms_country_condition.dto';

@Controller('workload/dpms-country-condition')
export class DpmsCountryConditionController {
    constructor(private readonly service: DpmsCountryConditionService) {}

    @Get('po')
    findCountryPo() {
        return this.service.findByType(1); // Assuming TYPE 1 for PO
    }

    @Get('shippingMark')
    findCountryShippingMark() {
        return this.service.findByType(2); // Assuming TYPE 2 for Shipping Mark
    }

    @Post()
    create(@Body() data: CreateCountryConditionDto) {
        return this.service.create(data);
    }

    @Delete()
    delete(@Body() data: DeleteCountryConditionDto) {
        return this.service.delete(data);
    }
}
