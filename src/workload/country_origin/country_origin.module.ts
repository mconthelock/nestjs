import { Module } from '@nestjs/common';
import { CountryOriginService } from './service/country_origin.service';
import { CountryOriginController } from './country_origin.controller';
import { CountryOriginRepository } from './country_origin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COUNTRY_ORIGIN } from 'src/common/Entities/workload/table/COUNTRY_ORIGIN.entity';
import { MigrateService } from './service/migrate.service';
import { CountryOriginCountryModule } from '../country_origin_country/country_origin_country.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([COUNTRY_ORIGIN], 'workloadConnection'),
        CountryOriginCountryModule,
    ],
    controllers: [CountryOriginController],
    providers: [CountryOriginService, MigrateService, CountryOriginRepository],
})
export class CountryOriginModule {}
