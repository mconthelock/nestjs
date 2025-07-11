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
  ],
})
export class DocinvModule {}
