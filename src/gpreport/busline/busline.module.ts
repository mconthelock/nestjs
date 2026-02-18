import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuslineController } from './busline.controller';
import { BuslineService } from './busline.service';

import { Busline } from '../../common/Entities/gpreport/table/busline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Busline], 'gpreportConnection')],
  controllers: [BuslineController],
  providers: [BuslineService],
})
export class BuslineModule {}
