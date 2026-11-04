import { Module } from '@nestjs/common';
import { CountryOriginNotSetViewService } from './country_origin_not_set_view.service';
import { CountryOriginNotSetViewRepository } from './country_origin_not_set_view.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COUNTRY_ORIGIN_NOT_SET_VIEW } from 'src/common/Entities/workload/views/COUNTRY_ORIGIN_NOT_SET_VIEW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        COUNTRY_ORIGIN_NOT_SET_VIEW,
    ], 'mitsuConnection'),
    ],
    providers: [CountryOriginNotSetViewService, CountryOriginNotSetViewRepository],
    exports: [CountryOriginNotSetViewService],
})
export class CountryOriginNotSetViewModule {}
