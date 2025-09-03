import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdepartmentService } from './pdepartment.service';
import { PdepartmentController } from './pdepartment.controller';
import { Pdepartment } from './entities/pdepartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pdepartment], 'webformConnection')],
  controllers: [PdepartmentController],
  providers: [PdepartmentService],
})
export class PdepartmentModule {}
