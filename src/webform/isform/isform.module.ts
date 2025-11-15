import { Module } from '@nestjs/common';
import { IsDevModule } from './is-dev/is-dev.module';
import { IsForm3Module } from './is-form3/is-form3.module';
import { IsMoModule } from './is-mo/is-mo.module';
import { IsForm1Module } from './is-form1/is-form1.module';
import { IsForm4Module } from './is-form4/is-form4.module';
import { Form1ObjectiveModule } from './form1-objective/form1-objective.module';
import { Form1WageModule } from './form1-wage/form1-wage.module';
import { CrdevicemstModule } from './crdevicemst/crdevicemst.module';
import { IsTidModule } from './is-tid/is-tid.module';
import { IsWorkloadModule } from './is-workload/is-workload.module';

@Module({
  imports: [IsDevModule, IsForm3Module, IsMoModule, IsForm1Module, IsForm4Module, Form1ObjectiveModule, Form1WageModule, CrdevicemstModule, IsTidModule, IsWorkloadModule],
})
export class ISFormModule {}
