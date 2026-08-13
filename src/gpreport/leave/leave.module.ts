import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

import { LeaveType } from 'src/common/Entities/gpreport/table/LEAVE_TYPE.entity';
import { LVAPP } from 'src/common/Entities/webform/table/LVAPP.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';
import { LR100P } from 'src/common/Entities/datacenter/table/LR100P.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [LeaveType, LVAPP, LR100P, User],
            'gpreportConnection',
        ),
        TypeOrmModule.forFeature([LR100P], 'datacenterConnection'),
    ],
    controllers: [LeaveController],
    providers: [LeaveService],
})
export class LeaveModule {}
