import { Controller, Get } from '@nestjs/common';
import { CountryOriginBulkListViewService } from './country_origin_bulk_list_view.service';

@Controller('workload/country-origin/bulk-list')
export class CountryOriginBulkListViewController {
  constructor(private readonly service: CountryOriginBulkListViewService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
