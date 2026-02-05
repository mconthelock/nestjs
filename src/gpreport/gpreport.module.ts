import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { BuslineModule } from './busline/busline.module';
import { BusstopModule } from './busstop/busstop.module';
import { BusrouteModule } from './busroute/busroute.module';

@Module({
  imports: [NewsModule, BuslineModule, BusstopModule, BusrouteModule],
})
export class gpreportModule {}
