import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

import { LeaveType } from 'src/common/Entities/gpreport/table/LEAVE_TYPE.entity';
import { LR100P } from 'src/common/Entities/gpreport/views/LR100P.entity';
import { LVAPP } from 'src/common/Entities/webform/table/LVAPP.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [LeaveType, LVAPP, LR100P],
            'gpreportConnection',
        ),
    ],
    controllers: [LeaveController],
    providers: [LeaveService],
})
export class LeaveModule {}
