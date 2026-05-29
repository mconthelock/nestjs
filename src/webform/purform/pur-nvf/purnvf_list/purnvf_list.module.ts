import { Module } from '@nestjs/common';
import { PurnvfListService } from './purnvf_list.service';
import { PurnvfListController } from './purnvf_list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURNVF_LIST } from 'src/common/Entities/webform/table/PURVNF_LIST.entity';
import { PurnvfListRepository } from './purnvf_list.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PURNVF_LIST], 'webformConnection')],
  controllers: [PurnvfListController],
  providers: [PurnvfListService, PurnvfListRepository],
  exports: [PurnvfListService],
})
export class PurnvfListModule {}
