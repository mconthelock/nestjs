import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuspassengerService } from './buspassenger.service';
import { BuspassengerController } from './buspassenger.controller';
import { Buspassenger } from 'src/common/Entities/gpreport/table/buspassenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Buspassenger], 'gpreportConnection')],
  controllers: [BuspassengerController],
  providers: [BuspassengerService],
})
export class BuspassengerModule {}
