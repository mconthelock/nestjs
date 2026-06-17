import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import { INV_HALFYEAR_REPORT } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT.entity';
import { INV_HALFYEAR_REPORT_ASSIGN } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT_ASSIGN.entity';
import { PSCIH_FORM } from 'src/common/Entities/webform/table/PSCIH_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class CheckinventoryRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') private readonly ds: DataSource) {
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

    async insertPscihForm(data: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
        REPORT_ID: number;
    }): Promise<void> {
        await this.getRepository(PSCIH_FORM).insert(data);
    }

    async createHalfyearReport(empno: string, periods: string): Promise<number> {
        const runner = this.ds.createQueryRunner();
        await runner.connect();
        const connection: any = (runner as any).databaseConnection;

        try {
            const result = await connection.execute(
                `BEGIN
                    SKIDCNTRL.SP_CREATE_HALFYEAR_REPORT(
                        P_CREATED_BY => :empno,
                        P_PERIODS    => :periods,
                        P_REPORT_ID  => :reportId
                    );
                END;`,
                {
                    empno,
                    periods,
                    reportId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                }
            );
            return result.outBinds.reportId;
        } finally {
            await runner.release();
        }
    }


}
