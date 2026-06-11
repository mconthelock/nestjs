import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateDpmsPlIssueDto } from './dto/update-dpms_pl_issue.dto';
import { DPMS_PL_ISSUE } from 'src/common/Entities/workload/table/DPMS_PL_ISSUE.entity';
import { CreateDpmsPlIssueDto } from './dto/create-dpms_pl_issue.dto';
import { DPMS_PL_ISSUE_PK } from 'src/mfgreport/dpms/packing-list-issue/packing-list-issue.interface';

@Injectable()
export class DpmsPlIssueRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
    findOne(dto: UpdateDpmsPlIssueDto) {
        return this.getRepository(DPMS_PL_ISSUE).findOne({
            where: { ...dto },
        });
    }

    create(dto: CreateDpmsPlIssueDto) {
        return this.getRepository(DPMS_PL_ISSUE).save(dto);
    }

    update(condition: DPMS_PL_ISSUE_PK, dto: UpdateDpmsPlIssueDto) {
        return this.getRepository(DPMS_PL_ISSUE).update(condition, dto);
    }
}
