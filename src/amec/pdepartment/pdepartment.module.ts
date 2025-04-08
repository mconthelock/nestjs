import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdepartmentService } from './pdepartment.service';
import { PdepartmentController } from './pdepartment.controller';
import { DepartmentSchema } from './entities/pdepartment.schema';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentSchema], 'amecConnection')],
  controllers: [PdepartmentController],
  providers: [PdepartmentService],
})
export class PdepartmentModule {}
