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
        GovernorTestModule
    ],
})
export class AmecMfgModule {}
