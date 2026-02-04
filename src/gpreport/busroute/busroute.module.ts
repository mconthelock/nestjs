import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusrouteService } from './busroute.service';
import { Busroute } from './entities/busroute.entity';
import { BusrouteController } from './busroute.controller';

@Module({
  controllers: [BusrouteController],
  imports: [TypeOrmModule.forFeature([Busroute], 'gpreportConnection')],
  providers: [BusrouteService],
})
export class BusrouteModule {}
