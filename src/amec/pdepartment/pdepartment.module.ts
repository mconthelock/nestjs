import { Module } from '@nestjs/common';
import { PdepartmentService } from './pdepartment.service';
import { PdepartmentController } from './pdepartment.controller';

@Module({
  controllers: [PdepartmentController],
  providers: [PdepartmentService],
})
export class PdepartmentModule {}
