import { Controller, Get, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
    constructor(private readonly service: CountriesService) {}

    @Get()
    getAllCountries(
        @Query('code') code?: string,
        @Query('code3') code3?: string,
        @Query('name_en') nameEn?: string,
        @Query('name_th') nameTh?: string,
        @Query('numeric') numeric?: string,
    ) {
        return this.service.searchCountries({
            code,
            code3,
            name_en: nameEn,
            name_th: nameTh,
            numeric,
        });
    }
}
