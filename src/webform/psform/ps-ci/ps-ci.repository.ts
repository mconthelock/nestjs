import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { INV_CHECK_LOG } from 'src/common/Entities/skid/table/PSINV_CHECK_LOG.entity';
import { INV_CHECK_RESULT } from 'src/common/Entities/skid/table/INV_CHECK_RESULT.entity';
import { DataSource } from 'typeorm';
import { GetDataFormDto } from './dto/create-ps-ci.dto';

@Injectable()
export class PsCiRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async getDataForm(dto: GetDataFormDto) {
        const { nfrmno, vorgno, cyear, cyear2, nrunno } = dto;

        const sql = `
            SELECT
                icr.ID,
                icr.GROUP_CODE,
                icr.CREATED_AT,
                icr.CHECK_DATE,
                ii.IBUYC,
                ii.IPROD,
                ii.IDESC,
                ii.IDRAW,
                ii.IABBT,
                icr.CONTROLLER_ID,
                icr.ON_HAND,
                ii.IUMS,
                icr.ACTUAL_QTY,
                icr.RANDOM_CHECK,
                icr.REMARK,
                icr.LEADER_REMARK,
                icr.ASSIGN_ID,
                ii.ZONE || '-' || SUBSTR(ii.USER_TNAME, 1, INSTR(ii.USER_TNAME || ' ', ' ') - 1) AS STNAME,
                a.STNAME AS LEADER_NAME
            FROM PSCI_FORM p
            LEFT JOIN SKIDCNTRL.INV_CHECK_RESULT icr ON p.ASSIGN_ID = icr.ASSIGN_ID
            LEFT JOIN SKIDCNTRL.MV_IMM_ITEMMST ii ON icr.ITEM_CODE = ii.IPROD
            LEFT JOIN AMEC.AMECUSERALL a ON icr.LEADER_ID = a.SEMPNO
            WHERE p.NFRMNO = :1
              AND p.VORGNO = :2
              AND p.CYEAR = :3
              AND p.CYEAR2 = :4
              AND p.NRUNNO = :5
            ORDER BY CONTROLLER_ID, ITEM_CODE
        `;

        const data = await this.manager.query(sql, [
            nfrmno,
            vorgno,
            cyear,
            cyear2,
            nrunno,
        ]);

        const assignId = data?.[0]?.ASSIGN_ID;
        if (!assignId) {
            return data;
        }

        const logs = await this.getRepository(INV_CHECK_LOG).find({
            where: { ASSIGN_ID: assignId },
            order: { EDIT_AT: 'DESC' },
        });

        const logMap = logs.reduce(
            (acc, log) => {
                const key = log.ITEM_CODE;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(log);
                return acc;
            },
            {} as Record<string, INV_CHECK_LOG[]>,
        );

        return data.map((row) => ({
            ...row,
            LOG_EDIT: logMap[row.IPROD] ?? [],
        }));
    }

    async saveLogs(data: Partial<INV_CHECK_LOG>[]) {
        return this.getRepository(INV_CHECK_LOG).save(data);
    }

    async getLogs(assignId: number) {
        return this.getRepository(INV_CHECK_LOG).find({
            where: { ASSIGN_ID: assignId },
            order: { LOG_ID: 'ASC' },
        });
    }

    async updateCheckResult(data: any[]) {
        return Promise.all(
            data.map((item) => {
                const keys = { ID: item.ID };
                const result = {
                    ACTUAL_QTY: item.ACTUAL_QTY,
                    RANDOM_CHECK: item.RANDOM_CHECK,
                    REMARK: item.REMARK,
                    LEADER_REMARK: item.LEADER_REMARK,
                    LAST_UPDATED: new Date(),
                };
                return this.getRepository(INV_CHECK_RESULT).update(keys, result);
            }),
        );
    }
}
