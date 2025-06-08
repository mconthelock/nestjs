import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsusersService } from './appsusers.service';
import { AppsusersController } from './appsusers.controller';
import { Appsuser } from './entities/appsuser.entity';

import { ApplicationModule } from '../application/application.module';
import { UsersModule } from '../../amec/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appsuser], 'amecConnection'),
    ApplicationModule,
    UsersModule,
  ],
  controllers: [AppsusersController],
  providers: [AppsusersService],
  exports: [AppsusersService],
})
export class AppsusersModule {}
