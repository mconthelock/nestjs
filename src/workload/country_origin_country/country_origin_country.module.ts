import { Module } from '@nestjs/common';
import { CountryOriginCountryService } from './country_origin_country.service';
import { CountryOriginCountryController } from './country_origin_country.controller';
import { CountryOriginCountryRepository } from './country_origin_country.repository';

@Module({
    controllers: [CountryOriginCountryController],
    providers: [CountryOriginCountryService, CountryOriginCountryRepository],
    exports: [CountryOriginCountryService],
})
export class CountryOriginCountryModule {}
