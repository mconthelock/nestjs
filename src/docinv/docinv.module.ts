import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AppsmenuModule } from './appsmenu/appsmenu.module';
import { AppsusersModule } from './appsusers/appsusers.module';
import { AppsgroupsModule } from './appsgroups/appsgroups.module';
import { AppsusersgroupsModule } from './appsusersgroups/appsusersgroups.module';
import { AppsmenuusersModule } from './appsmenuusers/appsmenuusers.module';
import { AccesslogModule } from './accesslog/accesslog.module';
import { WorkplanModule } from './workplan/workplan.module';
import { WorkpicModule } from './workpic/workpic.module';
import { SpecificationModule } from './specification/specification.module';
import { ReleaseModule } from './release/release.module';
import { ProgramModule } from './program/program.module';
import { ModulesModule } from './modules/modules.module';
import { RevisionModule } from './revision/revision.module';
import { SourceModule } from './source/source.module';
import { DatacenterModule } from './datacenter/datacenter.module';
import { WorkAnnualDevPlanModule } from './work-annual-dev-plan/work-annual-dev-plan.module';

@Module({
  imports: [
    ApplicationModule,
    AppsmenuModule,
    AppsusersModule,
    AppsgroupsModule,
    AppsusersgroupsModule,
    AppsmenuusersModule,
    AccesslogModule,
    WorkplanModule,
    WorkpicModule,
    SpecificationModule,
    ReleaseModule,
    ProgramModule,
    ModulesModule,
    RevisionModule,
    SourceModule,
    DatacenterModule,
    WorkAnnualDevPlanModule,
  ],
})
export class DocinvModule {}
