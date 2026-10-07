import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { UsersModule } from 'src/amec/users/users.module';

import { AttendanceIn } from 'src/common/Entities/figerdb/views/ATTENDANCEIN.entity';
import { AttendanceOut } from 'src/common/Entities/figerdb/views/ATTENDANCEOUT.entity';
import { WorkAdjust } from 'src/common/Entities/figerdb/table/WorkAdjust.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [AttendanceIn, AttendanceOut, WorkAdjust],
            'fingerConnection',
        ),
        UsersModule,
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule {}
