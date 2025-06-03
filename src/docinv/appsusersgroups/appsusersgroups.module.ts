import { Module } from '@nestjs/common';
import { AppsusersgroupsService } from './appsusersgroups.service';
import { AppsusersgroupsController } from './appsusersgroups.controller';

@Module({
  controllers: [AppsusersgroupsController],
  providers: [AppsusersgroupsService],
})
export class AppsusersgroupsModule {}
