import { Module } from '@nestjs/common';
import { IsDevModule } from './is-dev/is-dev.module';
import { IsForm3Module } from './is-form3/is-form3.module';
import { IsMoModule } from './is-mo/is-mo.module';
import { IsForm4Module } from './is-form4/is-form4.module';
import { Form1WageModule } from './form1-wage/form1-wage.module';
import { CrdevicemstModule } from './crdevicemst/crdevicemst.module';
import { IsTidModule } from './is-tid/is-tid.module';
import { IsWorkloadModule } from './is-workload/is-workload.module';
import { IsAdpModule } from './is-adp/is-adp.module';
import { IsFileModule } from './is-file/is-file.module';
import { IsCfsModule } from './is-cfs/is-cfs.module';
import { IsSefModule } from './is-sef/is-sef.module';
import { IsOffModule } from './is-off/is-off.module';
import { IsJdrModule } from './is-jdr/is-jdr.module';

@Module({
    imports: [
        IsDevModule,
        IsForm3Module,
        IsMoModule,
        IsForm4Module,
        Form1WageModule,
        CrdevicemstModule,
        IsTidModule,
        IsWorkloadModule,
        IsAdpModule,
        IsFileModule,
        IsCfsModule,
        IsSefModule,
        IsOffModule,
        IsJdrModule,
    ],
})
export class ISFormModule {}
