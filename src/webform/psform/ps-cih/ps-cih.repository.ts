import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { INV_HALFYEAR_RESULT } from 'src/common/Entities/skid/table/INV_HALFYEAR_RESULT.entity';
import { PSCIH_FORM } from 'src/common/Entities/webform/table/PSCIH_FORM.entity';

@Injectable()
export class PsCihRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async getDataForm(dto: FormDto) {
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = dto;

        const sql = `
            SELECT 
                pf.*,
                ihr.*,
                ii.*,
                ii.ZONE || '-' || SUBSTR(ii.USER_TNAME , 1, INSTR(ii.USER_TNAME || ' ', ' ') - 1) AS STNAME
            FROM PSCIH_FORM pf
            LEFT JOIN SKIDCNTRL.INV_HALFYEAR_RESULT ihr ON pf.REPORT_ID = ihr.REPORT_ID 
            LEFT JOIN SKIDCNTRL.MV_IMM_ITEMMST ii ON ii.IPROD = ihr.ITEM_CODE
            WHERE pf.NFRMNO = :1 AND pf.VORGNO = :2 AND pf.CYEAR = :3 AND pf.CYEAR2 = :4 AND pf.NRUNNO = :5
        `;

        const data = await this.manager.query(sql, [
            NFRMNO,
            VORGNO,
            CYEAR,
            CYEAR2,
            NRUNNO,
        ]);

        return data;
    }

    async getReportData(dto: FormDto) {
        return this.getRepository(PSCIH_FORM).find({
            where: dto,
            relations: { RESULT: { ITEM_DETAIL: true, LOG_EDIT: true } },
            order: { RESULT: { ITEM_CODE: 'ASC' } },
        });
    }

    async updateCheckResult(data: any[], empno: string) {
        return Promise.all(
            data.map((item) => {
                const keys = { ID: item.ID };
                const result = {
                    ACTUAL_QTY: item.ACTUAL_QTY,
                    RANDOM_CHECK: item.RANDOM_CHECK,
                    REMARK: item.REMARK,
                    LEADER_REMARK: item.LEADER_REMARK,
                    LAST_UPDATED: empno,
                    UPDATED_AT: () => 'SYSDATE',
                };
                return this.getRepository(INV_HALFYEAR_RESULT).update(
                    keys,
                    result,
                );
            }),
        );
    }
}
