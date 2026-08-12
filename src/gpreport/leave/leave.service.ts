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
            relations: ['user'],
        });
        return leaves;
    }

    async findBySection(seccode: string) {
        const leaves = await this.lvapp.find({
            where: {
                user: {
                    SSECCODE: seccode,
                },
            },
            relations: ['user'],
        });
        return leaves;
    }

    async findByDepartment(depcode: string) {
        const leaves = await this.lvapp.find({
            where: {
                user: {
                    SDEPCODE: depcode,
                },
            },
            relations: ['user'],
        });
        return leaves;
    }

    async findByDivision(divcode: string) {
        const leaves = await this.lvapp.find({
            where: {
                user: {
                    SDIVCODE: divcode,
                },
            },
            relations: ['user'],
        });
        return leaves;
    }
}
