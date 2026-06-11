import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PackingListIssueProcedureRepository extends OracleRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getReportProdList(prod: string) {
        return this.execCursor('DPMS_PL_PROD_REPORT', { prod }, ['prod']);
    }

    async getReportDayList(day: string) {
        return this.execCursor('DPMS_PL_DAY_REPORT', { day }, ['day']);
    }
}
