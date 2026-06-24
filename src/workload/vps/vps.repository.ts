import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class VpsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private readonly ds: DataSource,
        @InjectDataSource('packingConnection')
        private readonly packingDs: DataSource,
    ) {
        super(ds);
    }

    async chkPrint(order: string, packing: string): Promise<boolean> {
        const result = await this.packingDs
            .createQueryBuilder()
            .select('1')
            .from('PACKORDDTL', 'p')
            .where('p.ORDERNO = :order', { order })
            .andWhere('p.PACKNO = :packing', { packing })
            .andWhere('p.PRINTSTA = :printsta', { printsta: '1' })
            .getRawOne();

        return !!result;
    }

    async getDetailPIS(packing: string): Promise<any[]> {
        const sql = `
                SELECT
                    mk.M8K03,
                    SUBSTR(F_CPROD(mk.M8K01), -3) AS SCHEDULE,
                    mk.*,
                    sm.*,
                    p.*,
                    pl.*,
                    sch.max_date,
                    a.AGENT,
                    ao.PRODTYPE as PRODTYPE
                    ,CASE 
                        WHEN rc.CYEAR2 IS NOT NULL THEN '1'
                        ELSE '0'
                    END AS rev_con
                FROM M008KP mk
                JOIN S010MP sm
                    ON sm.S01M01 = mk.M8K03
                JOIN PACKORDDTL p
                    ON p.ORDERNO = mk.M8K03
                    AND p.PACKNO  = sm.S01M04
                LEFT JOIN (
                    SELECT schdnumber,
                            NEXTWORKDAY(MAX(workid),1) AS max_date
                    FROM AMECCALENDAR
                    GROUP BY schdnumber
                ) sch
                    ON sch.schdnumber = sm.S01M09
                LEFT JOIN AMECORDERS a
                    ON a.MFGNO = sm.S01M01
                LEFT JOIN (
                    SELECT pl.NFRMNO,pl.VORGNO,pl.CYEAR,pl.CYEAR2,pl.NRUNNO,ORDERNO,PACKNO,f.VREALAPV,f.CSTEPST
					FROM WEBFORM.PKRN_LIST pl 
					LEFT JOIN WEBFORM.FLOW f ON  pl.NFRMNO = f.NFRMNO AND pl.VORGNO = f.VORGNO AND pl.CYEAR = f.CYEAR AND pl.CYEAR2 = f.CYEAR2 AND pl.NRUNNO = f.NRUNNO
					WHERE CSTEPNO = '10' AND CSTEPST = '5'
					GROUP BY pl.NFRMNO,pl.VORGNO,pl.CYEAR,pl.CYEAR2,pl.NRUNNO,ORDERNO,PACKNO,f.VREALAPV,f.CSTEPST
                ) pl
                    ON pl.ORDERNO = sm.S01M01
                    AND pl.PACKNO = sm.S01M04
                LEFT JOIN REV_CONFIRM rc ON rc.CYEAR2 = pl.CYEAR2 AND rc.NRUNNO = pl.NRUNNO AND rc.\"ORDER\" = sm.S01M01 AND rc.PACKING = sm.S01M04     
                LEFT JOIN AMECORDERS ao ON ao.MFGNO = sm.S01M01
                WHERE sm.S01M04 = :packing
                AND sm.S01M17 IS NULL
                ORDER BY sch.max_date DESC,
                        mk.M8K02 ASC,
                        mk.M8K04 ASC
                        `;
        return await this.ds.query(sql, [ packing ]);
    }
}
