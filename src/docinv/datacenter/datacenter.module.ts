import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatacenterService } from './datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { ATableList } from './entities/a-table-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ATableList], 'amecConnection')],
  controllers: [DatacenterController],
  providers: [DatacenterService],
})
export class DatacenterModule {}
