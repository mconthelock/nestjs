import { Module } from '@nestjs/common';
import { StyPatrolInspectionService } from './sty-patrol-inspection.service';
import { StyPatrolInspectionController } from './sty-patrol-inspection.controller';
import { STY_PATROL_INSPECTION } from 'src/common/Entities/gpreport/views/STY_PATROL_INSPECTION.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StyPatrolInspectionRepository } from './sty-patrol-inspection.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([STY_PATROL_INSPECTION], 'gpreportConnection'),
    ],
    controllers: [StyPatrolInspectionController],
    providers: [StyPatrolInspectionService, StyPatrolInspectionRepository],
    exports: [StyPatrolInspectionService],
})
export class StyPatrolInspectionModule {}
