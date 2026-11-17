import { Body, Controller, Get, Post } from '@nestjs/common';
import { CountryOriginService } from './service/country_origin.service';
import { MigrateService } from './service/migrate.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { CreateCountryOriginDto } from './dto/create_country_origin.dto';

@Controller('workload/country-origin')
export class CountryOriginController {
    constructor(
        private readonly service: CountryOriginService,
        private readonly migrateService: MigrateService,
    ) {}

    @Get('migrate')
    @UseTransaction('mitsuConnection')
    migrate() {
        return this.migrateService.migrateCountryOrigin();
    }

    // @Get('country')
    // getCountry() {
    //     return this.service.getCountry();
    // }

    @Post()
    @UseTransaction('mitsuConnection')
    create(@Body() dto: CreateCountryOriginDto) {
        return this.service.create(dto);
    }

    @Post('upload-excel')
    @UseTransaction('mitsuConnection')
    uploadExcel(@Body() dto: CreateCountryOriginDto[]) {
        return this.service.create(dto);
    }
}
