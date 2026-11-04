import { Module } from '@nestjs/common';
import { PsYicService } from './ps-yic.service';
import { PsYicController } from './ps-yic.controller';
import { PsYicRepository } from './ps-yic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INV_YEARLY_RESULT } from 'src/common/Entities/skid/table/INV_YEARLY_RESULT.entity';
import { PSYIC_FORM } from 'src/common/Entities/webform/table/PSYIC_FORM.entity';
import { INV_YEARLY_ASSIGN } from '../../../common/Entities/skid/table/INV_YEARLY_ASSIGN.entity';
import { MV_IMM_ITEMMST } from '../../../common/Entities/skid/table/MV_IMM_ITEMMST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        INV_YEARLY_RESULT,
        PSYIC_FORM,
        INV_YEARLY_ASSIGN,
        MV_IMM_ITEMMST,
    ], 'mitsuConnection'),
    ],
    controllers: [PsYicController],
    providers: [PsYicService, PsYicRepository],
})
export class PsYicModule {}
