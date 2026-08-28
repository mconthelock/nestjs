import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { BuslineModule } from './busline/busline.module';
import { BusstopModule } from './busstop/busstop.module';
import { BusrouteModule } from './busroute/busroute.module';
import { BuspassengerModule } from './buspassenger/buspassenger.module';
import { OvertimeModule } from './overtime/overtime.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { StyImageModule } from './sty-image/sty-image.module';
import { StyTypeModule } from './sty-type/sty-type.module';
import { StyItemsModule } from './sty-items/sty-items.module';
import { StyPatrolInspectionModule } from './sty-patrol-inspection/sty-patrol-inspection.module';
import { StinpFormModule } from './stinp-form/stinp-form.module';
import { StinpFormListModule } from './stinp-form-list/stinp-form-list.module';
import { ExpatModule } from './expat/expat.module';
import { UniformModule } from './uniform/uniform.module';
import { LeaveModule } from './leave/leave.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MedicalModule } from './medical/medical.module';
import { TaxModule } from './tax/tax.module';
import { LoanModule } from './loan/loan.module';
import { ExpatModule } from './expat/expat.module';

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
        StyTypeModule,
        StyItemsModule,
        StyPatrolInspectionModule,
        StinpFormModule,
        StinpFormListModule,
        ExpatModule,
        UniformModule,
        LeaveModule,
        AttendanceModule,
        MedicalModule,
        TaxModule,
        LoanModule,
        ExpatModule,
    ],
})
export class gpreportModule {}
