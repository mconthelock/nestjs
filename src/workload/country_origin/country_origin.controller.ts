import { Controller, Get } from '@nestjs/common';
import { CountryOriginService } from './service/country_origin.service';
import { MigrateService } from './service/migrate.service';

@Controller('workload/country-origin')
export class CountryOriginController {
    constructor(
        private readonly service: CountryOriginService,
        private readonly migrateService: MigrateService,
    ) {}

    @Get('migrate')
    migrate() {
        return this.migrateService.migrateCountryOrigin();
    }
}
