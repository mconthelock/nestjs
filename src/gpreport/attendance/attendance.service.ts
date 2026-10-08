import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { UsersService } from 'src/amec/users/users.service';
import { AttendanceIn } from 'src/common/Entities/figerdb/views/ATTENDANCEIN.entity';
import { AttendanceOut } from 'src/common/Entities/figerdb/views/ATTENDANCEOUT.entity';
import { WorkAdjust } from 'src/common/Entities/figerdb/table/WorkAdjust.entity';

import { SearchAttendanceDto } from './dto/search-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(AttendanceIn, 'fingerConnection')
        private readonly timein: Repository<AttendanceIn>,

        @InjectRepository(AttendanceOut, 'fingerConnection')
        private readonly timeout: Repository<AttendanceOut>,

        @InjectRepository(WorkAdjust, 'fingerConnection')
        private readonly adjust: Repository<WorkAdjust>,

        private readonly usersService: UsersService,
    ) {}

    async search(searchCriteria: SearchAttendanceDto) {
        const { workAdjust: _workAdjust, ...q } = searchCriteria;
        const qtimein = this.timein.createQueryBuilder('timein');
        await applyDynamicFilters(qtimein, q, 'timein');
        const attendanceIn = await qtimein.getMany();

        const qtimeout = this.timeout.createQueryBuilder('timeout');
        await applyDynamicFilters(qtimeout, q, 'timeout');
        const attendanceOut = await qtimeout.getMany();

        const qadjust = this.adjust.createQueryBuilder('adjust');
        await applyDynamicFilters(
            qadjust,
            searchCriteria?.workAdjust,
            'adjust',
        );
        const workAdjust = await qadjust.getMany();
        return {
            attendanceIn,
            attendanceOut,
            workAdjust,
        };
    }
}
