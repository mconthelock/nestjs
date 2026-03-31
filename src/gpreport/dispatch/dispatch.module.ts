import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DispatchReportService } from './dispatch-report.service';
import { DispatchExportService } from './dispatch-export.service';
import { DispatchMailService } from './dispatch-mail.service';

import { BusDispatchHead } from '../../common/Entities/gpreport/table/bus_dispatch_head.entity';
import { BusDispatchLine } from '../../common/Entities/gpreport/table/bus_dispatch_line.entity';
import { BusDispatchStop } from '../../common/Entities/gpreport/table/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from '../../common/Entities/gpreport/table/bus_dispatch_passenger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [BusDispatchHead, BusDispatchLine, BusDispatchStop, BusDispatchPassenger],
      'gpreportConnection',
    ),
  ],
  controllers: [DispatchController],
  providers: [
    DispatchService,
    DispatchReportService,
    DispatchExportService,
    DispatchMailService,
  ],
  exports: [DispatchService],
})
export class DispatchModule {}