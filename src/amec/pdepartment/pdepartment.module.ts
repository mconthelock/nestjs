import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdepartmentService } from './pdepartment.service';
import { PdepartmentController } from './pdepartment.controller';
import { Pdepartment } from '../../common/Entities/amec/table/PDEPARTMENT.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pdepartment], 'mitsuConnection')],
    controllers: [PdepartmentController],
    providers: [PdepartmentService],
})
export class PdepartmentModule {}
