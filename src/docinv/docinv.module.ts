import { Module } from '@nestjs/common';
//ITAdmin [Application] & Form [Login]
import { ApplicationModule } from './application/application.module';
import { AppsmenuModule } from './appsmenu/appsmenu.module';
import { AppsusersModule } from './appsusers/appsusers.module';
import { AppsgroupsModule } from './appsgroups/appsgroups.module';
import { AppsmenuusersModule } from './appsmenuusers/appsmenuusers.module';
import { AccesslogModule } from './accesslog/accesslog.module';

//ITAdmin[Logs]
import { OslogsModule } from './oslogs/oslogs.module';
import { DblogsModule } from './dblogs/dblogs.module';
import { ApplogsModule } from './applogs/applogs.module';
import { TasklogsModule } from './tasklogs/tasklogs.module';
import { SpecialuserModule } from './specialuser/specialuser.module';

//ITAdmin[Datacenter]
import { DatacenterModule } from './datacenter/datacenter.module';

//ITAdmin[Workload]
import { DevplanModule } from './devplan/devplan.module';

//Not use (Now)
import { ProgramModule } from './program/program.module';
import { RevisionModule } from './revision/revision.module';
import { SourceModule } from './source/source.module';
@Module({
    imports: [
        ApplicationModule,
        AppsmenuModule,
        AppsusersModule,
        AppsgroupsModule,
        AppsmenuusersModule,
        AccesslogModule,
        OslogsModule,
        DblogsModule,
        ApplogsModule,
        TasklogsModule,
        SpecialuserModule,
        DatacenterModule,
        DevplanModule,
        //Not use (Now)
        ProgramModule,
        RevisionModule,
        SourceModule,
    ],
})
export class DocinvModule {}
