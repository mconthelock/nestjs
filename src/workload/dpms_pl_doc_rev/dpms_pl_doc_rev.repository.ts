import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, IsNull, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    CreateDpmsPlDocRevDto,
    SearchDpmsPlDocRevDto,
} from './dto/create-dpms_pl_doc_rev.dto';
import { DPMS_PL_DOC_REV } from 'src/common/Entities/workload/table/DPMS_PL_DOC_REV.entity';
import {
    getPendingRecordParams,
    findPreviousRevisionExcludingIssueRevParams,
} from 'src/mfgreport/dpms/packing-list-issue/packing-list-issue.interface';

@Injectable()
export class DpmsPlDocRevRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateDpmsPlDocRevDto) {
        return this.getRepository(DPMS_PL_DOC_REV).save(dto);
    }

    async update(
        condition: {
            VPROD: string;
            VP: string;
            VTYPE: string;
            VORDERS: string;
            NISSUEREV_ID: number;
        },
        data: Partial<CreateDpmsPlDocRevDto>,
    ) {
        return this.getRepository(DPMS_PL_DOC_REV).update(condition, data);
    }

    async getList(dto: SearchDpmsPlDocRevDto) {
        return this.getRepository(DPMS_PL_DOC_REV).find({
            where: dto,
        });
    }

    async getPendingRecord(condition: getPendingRecordParams) {
        return this.getRepository(DPMS_PL_DOC_REV).find({
            where: {
                VPROD: condition.VPROD,
                VP: condition.VP,
                VTYPE: condition.VTYPE,
                VORDERS: condition.VORDERS,
                NREV: condition.NREV,
                DFINISHALL: IsNull(),
            },
        });
        // return this.manager.query(
        //     `SELECT * FROM DPMS_PL_ISSUE_REV A
        //         WHERE A.VPROD   = :1
        //         AND   A.VP      = :2
        //         AND   A.VTYPE   = :3
        //         AND   A.VORDERS = :4
        //         AND  NOT EXISTS (
        //             SELECT 1
        //             FROM DPMS_PL_DOC_REV B
        //             WHERE A.VPROD = B.VPROD AND A.VP = B.VP AND A.VTYPE  = B.VTYPE AND A.VORDERS = B.VORDERS
        //         )`,
        //     [condition.VPROD, condition.VP, condition.VTYPE, condition.VORDERS],
        // );
    }

    async findPreviousRevisionExcludingIssueRev(
        condition: findPreviousRevisionExcludingIssueRevParams,
    ) {
        return this.getRepository(DPMS_PL_DOC_REV).find({
            where: {
                VPROD: condition.VPROD,
                VP: condition.VP,
                VTYPE: condition.VTYPE,
                VORDERS: condition.VORDERS,
                NREV: condition.NREV - 1,
                NISSUEREV_ID: Not(condition.NISSUEREV_ID),
            },
        });
    }
}
