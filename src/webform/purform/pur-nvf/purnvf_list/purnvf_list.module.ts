import { Module } from '@nestjs/common';
import { PurnvfListService } from './purnvf_list.service';
import { PurnvfListController } from './purnvf_list.controller';

@Module({
  controllers: [PurnvfListController],
  providers: [PurnvfListService],
})
export class PurnvfListModule {}
