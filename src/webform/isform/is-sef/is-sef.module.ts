import { Module } from '@nestjs/common';
import { IsSefService } from './is-sef.service';
import { IsSefController } from './is-sef.controller';
import { IsSefRepository } from './is-sef.repository';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ISEVA_SESSIONS } from 'src/common/Entities/webform/table/ISEVA_SESSIONS.entity';
import { ISEVA_SCORES } from 'src/common/Entities/webform/table/ISEVA_SCORES.entity';
import { ISEVA_CRITERIA } from 'src/common/Entities/webform/table/ISEVA_CRITERIA.entity';
import { WorkPlan } from 'src/common/Entities/docinv/table/work-plan.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        ISEVA_SESSIONS,
        ISEVA_SCORES,
        ISEVA_CRITERIA,
        WorkPlan,
    ], 'mitsuConnection'),FormmstModule, FormModule],
    controllers: [IsSefController],
    providers: [IsSefService, IsSefRepository],
})
export class IsSefModule {}
