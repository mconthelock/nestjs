import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form1ObjectiveService } from './form1-objective.service';
import { Form1Objective } from './entities/form1-objective.entity';
import { Form1ObjectiveController } from './form1-objective.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Form1Objective], 'webformConnection')],
  controllers: [Form1ObjectiveController],
  providers: [Form1ObjectiveService],
})
export class Form1ObjectiveModule {}
