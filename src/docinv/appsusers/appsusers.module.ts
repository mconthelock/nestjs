import { Module } from '@nestjs/common';
import { AppsusersService } from './appsusers.service';
import { AppsusersController } from './appsusers.controller';

@Module({
  controllers: [AppsusersController],
  providers: [AppsusersService],
})
export class AppsusersModule {}
