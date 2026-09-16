import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IIM } from 'src/common/Entities/datacenter/table/IIM.entity';

@Injectable()
export class IimRepository extends BaseRepository {
    constructor(@InjectDataSource('datacenterConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from S011MP`);
        // return this.getRepository(S011MP).find();
        return this.manager.find(IIM);
    }

    findByPlanner(planner: string) {
        return this.getRepository(IIM).findBy({
            IBUYC: planner,
        });
    }

    findPlannerCompareSheet(planner: string) {
        return this.getRepository(IIM).find({
            select: ['IBUYC', 'IPROD', 'IDRAW', 'IVEND'],
            where: {
                IBUYC: planner,
                IITYP: In(['1', '3']),
            },
        });
    }
}
