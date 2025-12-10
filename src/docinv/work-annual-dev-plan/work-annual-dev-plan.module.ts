import { Module } from '@nestjs/common';
import { WorkAnnualDevPlanService } from './work-annual-dev-plan.service';
import { WorkAnnualDevPlanController } from './work-annual-dev-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkAnnualDevPlan } from './entities/work-annual-dev-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkAnnualDevPlan], 'docinvConnection')],
  controllers: [WorkAnnualDevPlanController],
  providers: [WorkAnnualDevPlanService],
  exports: [WorkAnnualDevPlanService],
})
export class WorkAnnualDevPlanModule {}
