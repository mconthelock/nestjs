import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkplanService } from './workplan.service';
import { WorkplanController } from './workplan.controller';
import { Workplan } from './entities/workplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workplan], 'amecConnection')],
  controllers: [WorkplanController],
  providers: [WorkplanService],
  exports: [WorkplanService],
})
export class WorkplanModule {}
