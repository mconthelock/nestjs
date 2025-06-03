import { Module } from '@nestjs/common';
import { AppsgroupsService } from './appsgroups.service';
import { AppsgroupsController } from './appsgroups.controller';

@Module({
  controllers: [AppsgroupsController],
  providers: [AppsgroupsService],
})
export class AppsgroupsModule {}
