import { Module } from '@nestjs/common';
import { CountryOriginCountryService } from './country_origin_country.service';
import { CountryOriginCountryController } from './country_origin_country.controller';
import { CountryOriginCountryRepository } from './country_origin_country.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COUNTRY_ORIGIN_COUNTRY } from 'src/common/Entities/workload/table/COUNTRY_ORIGIN_COUNTRY.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        COUNTRY_ORIGIN_COUNTRY,
    ], 'mitsuConnection'),
    ],
    controllers: [CountryOriginCountryController],
    providers: [CountryOriginCountryService, CountryOriginCountryRepository],
    exports: [CountryOriginCountryService],
})
export class CountryOriginCountryModule {}
