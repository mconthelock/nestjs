import { Module } from '@nestjs/common';
import { DpmsCountryConditionService } from './dpms_country_condition.service';
import { DpmsCountryConditionController } from './dpms_country_condition.controller';
import { DpmsCountryConditionRepository } from './dpms_country_condition.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_COUNTRY_CONDITION } from 'src/common/Entities/workload/table/DPMS_COUNTRY_CONDITION.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        DPMS_COUNTRY_CONDITION,
    ], 'mitsuConnection'),
    ],
    controllers: [DpmsCountryConditionController],
    providers: [DpmsCountryConditionService, DpmsCountryConditionRepository],
})
export class DpmsCountryConditionModule {}
