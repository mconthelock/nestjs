import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AppsmenuModule } from './appsmenu/appsmenu.module';
import { AppsusersModule } from './appsusers/appsusers.module';
import { AppsgroupsModule } from './appsgroups/appsgroups.module';
import { AppsusersgroupsModule } from './appsusersgroups/appsusersgroups.module';
import { AppsmenuusersModule } from './appsmenuusers/appsmenuusers.module';

@Module({
  imports: [
    ApplicationModule,
    AppsmenuModule,
    AppsusersModule,
    AppsgroupsModule,
    AppsusersgroupsModule,
    AppsmenuusersModule,
  ],
})
export class DocinvModule {}
