import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import { INV_HALFYEAR_REPORT } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT.entity';
import { INV_HALFYEAR_REPORT_ASSIGN } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT_ASSIGN.entity';
import { PSCIH_FORM } from 'src/common/Entities/webform/table/PSCIH_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, IsNull } from 'typeorm';
import { UpdateYearlyDto } from './dto/update-yearly.dto';
import { CreateYearlyFormDto } from './dto/create-yearlyform.dto';
import { PSYIC_FORM } from 'src/common/Entities/webform/table/PSYIC_FORM.entity';
import { INV_YEARLY_RESULT } from 'src/common/Entities/skid/table/INV_YEARLY_RESULT.entity';

@Injectable()
export class CheckinventoryRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
    ) {
        super(ds);
    }

    async getReportData() {
        return this.getRepository(INV_HALFYEAR_REPORT).find({
            relations: ['ASSIGN_LIST', 'ASSIGN_LIST.PSCI_FORM', 'PSCIH_FORM'],
        });
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

    async createHalfyearReport(
        empno: string,
        periods: string,
    ): Promise<number> {
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
                },
            );
            return result.outBinds.reportId;
        } finally {
            await runner.release();
        }
    }

    async createYearlyReport(
        YEAR: string,
        PERIOD: string,
        EMPNO: string,
    ): Promise<number> {
        const runner = this.ds.createQueryRunner();
        await runner.connect();
        const connection: any = (runner as any).databaseConnection;

        try {
            const result = await connection.execute(
                `BEGIN
                    SKIDCNTRL.SP_CREATE_YEARLY_RESULT(
                        P_YEAR      => :year,
                        P_PERIOD    => :period,
                        P_CREATE_BY => :empno
                    );
                END;`,
                {
                    year: YEAR,
                    period: PERIOD,
                    empno: EMPNO,
                },
            );
            return result.outBinds.reportId;
        } finally {
            await runner.release();
        }
    }

    // async updateYearlyReport(dto: UpdateYearlyDto) {
    //     const { reportID, detail } = dto;

    //     await this.ds.transaction(async (manager) => {
    //         for (const item of detail) {
    //             await manager
    //                 .createQueryBuilder()
    //                 .update('SKIDCNTRL.INV_YEARLY_RESULT')
    //                 .set({
    //                     ACTUAL_QTY: item.ACTUAL,
    //                 })
    //                 .where('IYA_ID = :reportID', { reportID })
    //                 .andWhere('TAG_NO = :tagNo', { tagNo: item.TAG_NO })
    //                 .andWhere('ITEM_CODE = :itemCode', {
    //                     itemCode: item.ITEM_CODE,
    //                 })
    //                 .execute();
    //         }
    //     });

    //     return {
    //         success: true,
    //         updated: detail.length,
    //     };
    // }

    async updateYearlyReport(dto: UpdateYearlyDto) {
        const { reportID, detail } = dto;

        const payload = JSON.stringify(
            detail.map((item) => ({
                TAG_NO: item.TAG_NO,
                ITEM_CODE: item.ITEM_CODE,
                ACTUAL: item.ACTUAL,
            })),
        );

        await this.ds.query(
            `
            MERGE INTO SKIDCNTRL.INV_YEARLY_RESULT target
            USING (
                SELECT
                    jt.TAG_NO,
                    jt.ITEM_CODE,
                    jt.ACTUAL
                FROM JSON_TABLE(
                    :payload,
                    '$[*]'
                    COLUMNS (
                        TAG_NO    VARCHAR2(50) PATH '$.TAG_NO',
                        ITEM_CODE VARCHAR2(50) PATH '$.ITEM_CODE',
                        ACTUAL    NUMBER       PATH '$.ACTUAL'
                    )
                ) jt
            ) source
            ON (
                target.IYA_ID = :reportID
                AND target.TAG_NO = source.TAG_NO
                AND target.ITEM_CODE = source.ITEM_CODE
            )
            WHEN MATCHED THEN
                UPDATE SET target.ACTUAL_QTY = source.ACTUAL
            `,
            [{ type: oracledb.CLOB, val: payload }, reportID],
        );

        return {
            success: true,
            updated: detail.length,
        };
    }

    // function check checked all actual
    async checkAllActualChecked(
        reportID: number,
    ): Promise<{ success: boolean }> {
        const result = await this.getRepository(INV_YEARLY_RESULT).count({
            where: {
                IYA_ID: reportID,
                ACTUAL_QTY: IsNull(),
            },
        });
        console.log('checkAllActualChecked result:', result);
        return { success: result === 0 };
    }

    async insertYearlyForm(dto: CreateYearlyFormDto) {
        console.log('insertYearlyForm dto:', dto);
        await this.getRepository(PSYIC_FORM).insert({ ...dto, IYA_ID: dto.ID });
    }

    async getYearlyResult(reportID: number) {
        const sql = `
            SELECT iyr.*, 
                CASE 
                    WHEN a.STNAME IS NOT NULL 
                    THEN mii.ZONE || '-' || REGEXP_SUBSTR(a.STNAME, '\\S+', 1, 1)
                    ELSE '**OFFICE'
                END AS USER_NAME, 
                mii.ZONE
            FROM SKIDCNTRL.INV_YEARLY_RESULT iyr
            LEFT JOIN AMECUSERALL a ON iyr.USER_ID = a.SEMPNO
            LEFT JOIN SKIDCNTRL.MV_IMM_ITEMMST mii ON iyr.ITEM_CODE = mii.IPROD
            WHERE iyr.IYA_ID = :id
            ORDER BY TAG_NO
        `;
        return this.ds.query(sql, [reportID]);
    }
}
