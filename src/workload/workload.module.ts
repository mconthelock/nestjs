import { Module } from '@nestjs/common';
import { IdtagEfacLogModule } from './idtag-efac-log/idtag-efac-log.module';
import { DpmsPackingListModule } from './dpms_packing_list/dpms_packing_list.module';

@Module({
  imports: [IdtagEfacLogModule, DpmsPackingListModule],
})
export class WorkloadModule {}
