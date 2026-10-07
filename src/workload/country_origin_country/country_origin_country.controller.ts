import { Controller, Get } from '@nestjs/common';
import { CountryOriginCountryService } from './country_origin_country.service';

@Controller('workload/country-origin')
export class CountryOriginCountryController {
    constructor(private readonly service: CountryOriginCountryService) {}

    @Get('country')
    getCountry() {
        return this.service.getCountry();
    }
}
