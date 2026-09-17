import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

import { LeaveType } from 'src/common/Entities/gpreport/table/LEAVE_TYPE.entity';
import { LR100P } from 'src/common/Entities/gpreport/views/LR100P.entity';
import { LVAPP } from 'src/common/Entities/webform/table/LVAPP.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [LeaveType, LVAPP, LR100P, User],
            'gpreportConnection',
        ),
    ],
    controllers: [LeaveController],
    providers: [LeaveService],
})
export class LeaveModule {}
