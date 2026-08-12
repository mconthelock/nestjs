import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

import { LeaveType } from 'src/common/Entities/gpreport/table/LEAVE_TYPE.entity';
import { LR100P } from 'src/common/Entities/datacenter/table/LR100P.entity';
import { LVAPP } from 'src/common/Entities/webform/table/LVAPP.entity';

@Injectable()
export class LeaveService {
    constructor(
        @InjectRepository(LVAPP, 'gpreportConnection')
        private readonly lvapp: Repository<LVAPP>,
    ) {}

    async findByEmployee(empId: string) {
        const leaves = await this.lvapp.find({
            where: {
                EMPNO: empId,
            },
            relations: ['types', 'actual'],
        });
        return leaves;
    }

    async findBySection(empId: string) {
        const leaves = await this.lvapp.find({
            where: {
                EMPNO: empId,
            },
        });
        return leaves;
    }

    async findByDepartment(empId: string) {
        const leaves = await this.lvapp.find({
            where: {
                EMPNO: empId,
            },
        });
        return leaves;
    }

    async findByDivision(empId: string) {
        const leaves = await this.lvapp.find({
            where: {
                EMPNO: empId,
            },
        });
        return leaves;
    }
}
