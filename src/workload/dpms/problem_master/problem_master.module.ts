import { Module } from '@nestjs/common';
import { ProblemMasterService } from './problem_master.service';
import { ProblemMasterController } from './problem_master.controller';

@Module({
  controllers: [ProblemMasterController],
  providers: [ProblemMasterService],
})
export class ProblemMasterModule {}
