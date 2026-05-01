import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { BuslineModule } from './busline/busline.module';
import { BusstopModule } from './busstop/busstop.module';
import { BusrouteModule } from './busroute/busroute.module';
import { BuspassengerModule } from './buspassenger/buspassenger.module';
import { OvertimeModule } from './overtime/overtime.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { StyImageModule } from './sty-image/sty-image.module';
import { StyPatrolModule } from './sty-patrol/sty-patrol.module';
import { StyTypeModule } from './sty-type/sty-type.module';

@Module({
    imports: [
        NewsModule,
        BuslineModule,
        BusstopModule,
        BusrouteModule,
        BuspassengerModule,
        OvertimeModule,
        DispatchModule,
        StyImageModule,
        StyPatrolModule,
        StyTypeModule,
    ],
})
export class gpreportModule {}
