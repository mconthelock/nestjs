import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { INV_HALFYEAR_REPORT } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT.entity';
import { INV_HALFYEAR_REPORT_ASSIGN } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT_ASSIGN.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class CheckinventoryRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async getReportData() {
        return this.getRepository(INV_HALFYEAR_REPORT).find(
            { relations: ['ASSIGN_LIST', 'ASSIGN_LIST.PSCI_FORM', 'PSCIH_FORM'] }
        );
    }

    async getReportAssign(REPORT_ID: number) {
        return this.getRepository(INV_HALFYEAR_REPORT_ASSIGN).find({
            where: { REPORT_ID },
        });
    }
}
