import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatacenterService } from './datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { TableCheck } from './entities/table-check.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TableCheck], 'amecConnection')],
  controllers: [DatacenterController],
  providers: [DatacenterService],
})
export class DatacenterModule {}
