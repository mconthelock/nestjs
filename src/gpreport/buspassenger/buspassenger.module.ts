import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuspassengerService } from './buspassenger.service';
import { Buspassenger } from './entities/buspassenger.entity';
import { BuspassengerController } from './buspassenger.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Buspassenger], 'gpreportConnection')],
  controllers: [BuspassengerController],
  providers: [BuspassengerService],
})
export class BuspassengerModule {}
