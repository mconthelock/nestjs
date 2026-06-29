import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import type { SearchDpmsPlIssueDto } from '../dpms_pl_issue/dto/search-dpms_pl_issue.dto';
import { DPMS_PL_LAST_REVISION_VIEW } from 'src/common/Entities/workload/views/DPMS_PL_LAST_REVISION_VIEW.entity';

@Injectable()
export class DpmsPlLastRevisionViewRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getLastRevision(dto: SearchDpmsPlIssueDto) {
        return this.getRepository(DPMS_PL_LAST_REVISION_VIEW).find({
            where: dto,
        });
    }
}
