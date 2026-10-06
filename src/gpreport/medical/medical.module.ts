import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';

import { OPDRIGHT } from 'src/common/Entities/webform/table/OPDRIGHT.entity';
import { WelfareDetailView } from 'src/common/Entities/webform/views/VIEW_WELFARE_DETAIL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [OPDRIGHT, WelfareDetailView],
            'webformConnection',
        ),
    ],
    controllers: [MedicalController],
    providers: [MedicalService],
})
export class MedicalModule {}
