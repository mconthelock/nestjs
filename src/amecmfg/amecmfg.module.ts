import { Module } from '@nestjs/common';
import { AmeccalendarModule } from './ameccalendar/ameccalendar.module';
import { AvmModule } from './avm/avm.module';
import { LockPisModule } from './lock-pis/lock-pis.module';
import { IdtagModule } from './idtag/idtag.module';
import { F110kpModule } from './f110kp/f110kp.module';
import { PisModule } from './pis/pis.module';
import { StaticTestModule } from './static-test/static-test.module';
import { LoadLessTestModule } from './load-less-test/load-less-test.module';
import { GovernorTestModule } from './governor-test/governor-test.module';
import { PullTestModule } from './pull-through-force-test/pull-test.module';
import { F001kpModule } from './f001kp/f001kp.module';
import { F002kpModule } from './f002kp/f002kp.module';
import { F003kpModule } from './f003kp/f003kp.module';
import { M008kpModule } from './m008kp/m008kp.module';
import { Q141kpModule } from './q141kp/q141kp.module';

@Module({
    imports: [
        AmeccalendarModule,
        AvmModule,
        LockPisModule,
        IdtagModule,
        F110kpModule,
        PisModule,
        StaticTestModule,
        LoadLessTestModule,
        GovernorTestModule,
        PullTestModule,
        F001kpModule,
        F002kpModule,
        F003kpModule,
        M008kpModule,
        Q141kpModule,
    ],
})
export class AmecMfgModule {}
