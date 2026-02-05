import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { BuslineModule } from './busline/busline.module';
import { BusstopModule } from './busstop/busstop.module';

@Module({
  imports: [NewsModule, BuslineModule, BusstopModule],
})
export class gpreportModule {}
