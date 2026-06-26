import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class VpsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private readonly wk: DataSource,
        @InjectDataSource('packingConnection')
        private readonly packingDs: DataSource,
    ) {
        super(wk);
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

    async chkOrder(order: string, packing: string): Promise<boolean> {
        const result = await this.packingDs
            .createQueryBuilder()
            .select('1')
            .from('PACKORDDTL', 'p')
            .where('p.ORDERNO = :order', { order })
            .andWhere('p.PACKNO = :packing', { packing })
            .getRawOne();

        return !!result;
    }

    async chkItemMas(order: string, packing: string): Promise<boolean> {
        const result = await this.packingDs
            .createQueryBuilder()
            .select('1')
            .from('ItemMas', 'im')
            .where('im.orderno = :order', { order })
            .andWhere('im.packno = :packing', { packing })
            .getRawOne();

        return !!result;
    }

    // เทียบเท่า chk_ItemQty()
    async chkItemQty(order: string, packing: string): Promise<boolean> {
        const result = await this.packingDs
            .createQueryBuilder()
            .select('1')
            .from('ItemQty', 'iq')
            .where('iq.ordrno = :order', { order })
            .andWhere('iq.itemno = :packing', { packing })
            .getRawOne();

        return !!result;
    }

    async chkPISinfo(order: string, subPacking: string): Promise<boolean> {
        const result = await this.packingDs
            .createQueryBuilder()
            .select('1')
            .from('PISInfo', 'pi')
            .where('pi.orderno = :order', { order })
            .andWhere('pi.item = :subPacking', { subPacking })
            .getRawOne();

        return !!result;
    }

    async insertPrintHistory(data: {
        orderNo: string;
        packingNo: string;
        quantity: number;
        users: string;
    }): Promise<void> {
        await this.wk
            .createQueryBuilder()
            .insert()
            .into('PRINT_HISTORY')
            .values({
                ORDER_NO: data.orderNo,
                PACKING_NO: data.packingNo,
                QUANTITY: data.quantity,
                USERS: data.users,
            })
            .execute();
    }

    async insertPrintlogVps(data: {
        orderNo: string;
        packingNo: string;
        qty: number;
        ip: string;
        users: string;
    }): Promise<void> {
        await this.wk
            .createQueryBuilder()
            .insert()
            .into('PRINT_LOG_VPS_OTHER')
            .values({
                ORDER_NO: data.orderNo,
                PACKING_NO: data.packingNo,
                PRINT_QTY: data.qty,
                PRINTER: data.ip,
                USERS: data.users,
            })
            .execute();
    }

    async insPackorddtlByManual(order: string, packing: string): Promise<void> {
        await this.packingDs.query('EXEC InsPackorddtlByManual ?, ?', [
            order,
            packing,
        ]);
    }

    async updatePrintStatus(order: string, packing: string): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .update('PACKORDDTL')
            .set({ PRINTSTA: '1' })
            .where('ORDERNO = :order', { order })
            .andWhere('PACKNO = :packing', { packing })
            .execute();
    }

    async insertItemMas(data: Record<string, any>): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .insert()
            .into('ItemMas')
            .values(data)
            .execute();
    }

    async insertItemQty(data: Record<string, any>): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .insert()
            .into('ItemQty')
            .values(data)
            .execute();
    }

    async insertPISInfo(data: Record<string, any>): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .insert()
            .into('PISInfo')
            .values(data)
            .execute();
    }

    async insertVPSInfo(data: Record<string, any>): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .insert()
            .into('VPSInfo')
            .values(data)
            .execute();
    }

    async insertItemQtyHistory(data: Record<string, any>): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .insert()
            .into('ItemQtyHistory')
            .values(data)
            .execute();
    }

    async getVPSDetail(order: string, packing: string) {
        const sql = `SELECT S01M01,S01M04,S01M09,M8K02,S01M06,S01M05,S01M08,F_CPROD(S01M09) AS SCHEDULE
                FROM S010MP s01
                JOIN M008KP mk ON mk.M8K03 = s01.S01M01
                WHERE (S01M01 = :1 OR S01M01 LIKE :2)
                AND S01M04 LIKE :3`;
        return await this.wk.query(sql, [
            `${order}`,
            `_${order}_`,
            `%${packing}%`,
        ]);
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
        return await this.wk.query(sql, [packing]);
    }
}
