import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkpicService } from './workpic.service';
import { WorkpicController } from './workpic.controller';
import { Workpic } from './entities/workpic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workpic], 'docinvConnection')],
  controllers: [WorkpicController],
  providers: [WorkpicService],
})
export class WorkpicModule {}
