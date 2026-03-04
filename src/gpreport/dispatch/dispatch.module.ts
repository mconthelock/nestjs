import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';

import { BusDispatchHead } from './entities/bus_dispatch_head.entity';
import { BusDispatchLine } from './entities/bus_dispatch_line.entity';
import { BusDispatchStop } from './entities/bus_dispatch_stop.entity';
import { BusDispatchPassenger } from './entities/bus_dispatch_passenger.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BusDispatchHead, BusDispatchLine, BusDispatchStop, BusDispatchPassenger],'gpreportConnection',),],
  controllers: [DispatchController],providers: [DispatchService],exports: [DispatchService],
})
export class DispatchModule {}