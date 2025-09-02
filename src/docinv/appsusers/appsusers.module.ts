import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsusersService } from './appsusers.service';
import { AppsusersController } from './appsusers.controller';
import { Appsuser } from './entities/appsuser.entity';

import { ApplicationModule } from '../application/application.module';
import { UsersModule } from '../../amec/users/users.module';
import { AppsgroupsModule } from '../appsgroups/appsgroups.module';
import { AccesslogModule } from '../accesslog/accesslog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appsuser], 'docinvConnection'),
    UsersModule,
    ApplicationModule,
    AppsgroupsModule,
    AccesslogModule,
  ],
  controllers: [AppsusersController],
  providers: [AppsusersService],
  exports: [AppsusersService],
})
export class AppsusersModule {}
