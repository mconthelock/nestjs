import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { UsersService } from 'src/amec/users/users.service';
import { AttendanceIn } from 'src/common/Entities/figerdb/views/ATTENDANCEIN.entity';
import { AttendanceOut } from 'src/common/Entities/figerdb/views/ATTENDANCEOUT.entity';
import { SearchAttendanceDto } from './dto/search-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(AttendanceIn, 'fingerConnection')
        private readonly timein: Repository<AttendanceIn>,

        @InjectRepository(AttendanceOut, 'fingerConnection')
        private readonly timeout: Repository<AttendanceOut>,

        private readonly usersService: UsersService,
    ) {}

    async search(searchCriteria: SearchAttendanceDto) {
        const qtimein = this.timein.createQueryBuilder('timein');
        await applyDynamicFilters(qtimein, searchCriteria, 'timein');
        const attendanceIn = await qtimein.getMany();

        const qtimeout = this.timein.createQueryBuilder('timein');
        await applyDynamicFilters(qtimeout, searchCriteria, 'timein');
        const attendanceOut = await qtimeout.getMany();

        return {
            attendanceIn,
            attendanceOut,
        };
    }
}
