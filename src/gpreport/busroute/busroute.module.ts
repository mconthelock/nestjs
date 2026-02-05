import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusrouteService } from './busroute.service';
import { BusrouteController } from './busroute.controller';
import { Busroute } from './entities/busroute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Busroute], 'gpreportConnection')],
  controllers: [BusrouteController],
  providers: [BusrouteService],
})
export class BusrouteModule {}
