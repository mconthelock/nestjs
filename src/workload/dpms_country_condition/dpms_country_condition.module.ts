import { Module } from '@nestjs/common';
import { DpmsCountryConditionService } from './dpms_country_condition.service';
import { DpmsCountryConditionController } from './dpms_country_condition.controller';
import { DpmsCountryConditionRepository } from './dpms_country_condition.repository';

@Module({
    controllers: [DpmsCountryConditionController],
    providers: [DpmsCountryConditionService, DpmsCountryConditionRepository],
})
export class DpmsCountryConditionModule {}
