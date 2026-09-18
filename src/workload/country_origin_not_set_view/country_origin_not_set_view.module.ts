import { Module } from '@nestjs/common';
import { CountryOriginNotSetViewService } from './country_origin_not_set_view.service';
import { CountryOriginNotSetViewRepository } from './country_origin_not_set_view.repository';

@Module({
    providers: [
        CountryOriginNotSetViewService,
        CountryOriginNotSetViewRepository,
    ],
    exports: [CountryOriginNotSetViewService],
})
export class CountryOriginNotSetViewModule {}
