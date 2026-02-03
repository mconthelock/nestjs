import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { BusrouteModule } from './busroute/busroute.module';
import { BusstationModule } from './busstation/busstation.module';

@Module({
  imports: [NewsModule, BusrouteModule, BusstationModule],
})
export class gpreportModule {}
