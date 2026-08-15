import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';

import { Overtime } from 'src/common/Entities/gpreport/table/overtime.entity';
import { OTFORM } from 'src/common/Entities/webform/table/OTFORM.entity';
import { LR200P } from 'src/common/Entities/gpreport/table/LR200P.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Overtime, LR200P, OTFORM],
            'gpreportConnection',
        ),
    ],
    controllers: [OvertimeController],
    providers: [OvertimeService],
})
export class OvertimeModule {}
