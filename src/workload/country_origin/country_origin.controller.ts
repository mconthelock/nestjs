import { Controller, Get } from '@nestjs/common';
import { CountryOriginService } from './service/country_origin.service';
import { MigrateService } from './service/migrate.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('workload/country-origin')
export class CountryOriginController {
    constructor(
        private readonly service: CountryOriginService,
        private readonly migrateService: MigrateService,
    ) {}

    @Get('migrate')
    @UseTransaction('workloadConnection')
    migrate() {
        return this.migrateService.migrateCountryOrigin();
    }

    @Get('country')
    getCountry() {
        return this.service.getCountry();
    }
}
