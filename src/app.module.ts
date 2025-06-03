import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './databases/amec.config';

import { AmecModule } from './amec/amec.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationModule } from './docinv/application/application.module';
import { AppsmenuModule } from './docinv/appsmenu/appsmenu.module';
import { AppsusersModule } from './docinv/appsusers/appsusers.module';
import { AppsgroupsModule } from './docinv/appsgroups/appsgroups.module';
import { AppsusersgroupsModule } from './docinv/appsusersgroups/appsusersgroups.module';
import { JobOrderModule } from './joborder/joborder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Comment
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    AuthModule,
    AmecModule,
    JobOrderModule,
    ApplicationModule,
    AppsmenuModule,
    AppsusersModule,
    AppsgroupsModule,
    AppsusersgroupsModule,
  ],
})
export class AppModule {}
