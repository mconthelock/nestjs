import { Module } from '@nestjs/common';
import { CountryOriginBulkListViewService } from './country_origin_bulk_list_view.service';
import { CountryOriginBulkListViewController } from './country_origin_bulk_list_view.controller';
import { CountryOriginBulkListViewRepository } from './country_origin_bulk_list_view.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COUNTRY_ORIGIN_BULK_LIST_VIEW } from 'src/common/Entities/workload/views/COUNTRY_ORIGIN_BULK_LIST_VIEW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [COUNTRY_ORIGIN_BULK_LIST_VIEW],
            'workloadConnection',
        ),
    ],
    controllers: [CountryOriginBulkListViewController],
    providers: [
        CountryOriginBulkListViewService,
        CountryOriginBulkListViewRepository,
    ],
})
export class CountryOriginBulkListViewModule {}
