import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateDpmsPlIssueRevDto } from './dto/create-dpms_pl_issue_rev.dto';
import { DPMS_PL_ISSUE_REV } from 'src/common/Entities/workload/table/DPMS_PL_ISSUE_REV.entity';
import { dpmsPlIssueRevFindLatestRevision } from './dpms_pl_issue_rev.interface';

@Injectable()
export class DpmsPlIssueRevRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(dto: CreateDpmsPlIssueRevDto) {
        return this.getRepository(DPMS_PL_ISSUE_REV).save({
            ...dto,
            DISSUEDATE: new Date(),
        });
    }

    findLatestRevision(condition: dpmsPlIssueRevFindLatestRevision) {
        return this.getRepository(DPMS_PL_ISSUE_REV).findOne({
            where: condition,
            // {
            //     VPROD: condition.VPROD,
            //     VP: condition.VP,
            //     VTYPE: condition.VTYPE,
            //     VORDERS: condition.VORDERS,
            //     // NISSUE_TYPE: condition.NISSUE_TYPE,
            //     // NROUND: condition.NROUND,
            // },
            order: {
                NREV: 'DESC',
                NROUND: 'DESC',
            },
        });
    }
}
