import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    async findBySection(seccode: string) {
        const leaves = await this.lvapp.find({
            where: {user.SSECCODE: seccode},
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
