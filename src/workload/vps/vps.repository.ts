import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConectionService } from 'src/as400/conection/conection.service';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InsertCartonDto, InsertListCartonDto } from './dto/insertCarton.dto';
import { PKC_CARTON_DETAIL } from 'src/common/Entities/workload/table/PKC_CARTON_DETAIL.entity';

@Injectable()
export class VpsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private readonly wk: DataSource,
        @InjectDataSource('packingConnection')
        private readonly packingDs: DataSource,
        private as400: ConectionService,
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

    async lastPrintHistory(order: string, packing: string): Promise<any> {
        const result = await this.wk
            .createQueryBuilder()
            .select('*')
            .from('PRINT_LOG_VPS_OTHER', 'plvo')
            .where('ORDER_NO = :order', { order })
            .andWhere('PACKING_NO = :packing', { packing })
            .orderBy('PRINTDATE', 'DESC')
            .getRawOne();

        return result;
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
        reprintCause?: string;
        remark?: string;
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
                REPRINT_CAUSE: data.reprintCause,
                REMARK: data.remark,
            })
            .execute();
    }

    async insPackorddtlByManual(order: string, packing: string): Promise<void> {
        await this.packingDs.query('EXEC InsPackorddtlByManual @0, @1', [
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

    async insertPackorddtl(data: Record<string, any>): Promise<void> {
        await this.packingDs
            .createQueryBuilder()
            .insert()
            .into('packorddtl')
            .values(data)
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

    async reprintPackingOrder(data: {
        order: string;
        packing: string;
        production: string;
        p: string;
        partname: string;
        project: string;
        schedl: string;
        piscode: string;
        qtyPrint: number;
        empno: string;
        subPacking: string;
    }): Promise<void> {
        const qr = this.packingDs.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            await qr.manager
                .createQueryBuilder()
                .delete()
                .from('PISInfo')
                .where('orderno = :order', { order: data.order })
                .andWhere('item = :subPacking', { subPacking: data.subPacking })
                .execute();

            await qr.manager
                .createQueryBuilder()
                .delete()
                .from('VPSInfo')
                .where('orderno = :order', { order: data.order })
                .andWhere('item = :packing', { packing: data.packing })
                .execute();

            const now = new Date();
            const formattedSchedl =
                data.schedl?.length >= 7
                    ? `${data.schedl.slice(4, 7)}${data.schedl.slice(2, 4)}`
                    : data.schedl;

            for (let i = 0; i < data.qtyPrint; i++) {
                const row = String(i + 1).padStart(4, '0');
                const pis = `${data.piscode}-${row}`;

                await qr.manager
                    .createQueryBuilder()
                    .insert()
                    .into('PISInfo')
                    .values({
                        production: data.production,
                        p: data.p,
                        orderno: data.order,
                        seq: '0',
                        item: data.subPacking,
                        pis,
                        partname: data.partname,
                        packshop: 'PC',
                        projectno: data.project,
                        schedl: formattedSchedl,
                        itemseq: i + 1,
                        qty: data.qtyPrint,
                        ncopy: '1',
                        printflg: '0',
                        rdel: '0',
                        upduser: data.empno,
                        upddate: now,
                        trndata: '0',
                        itemtype: '0',
                        printtype: '0',
                    })
                    .execute();

                await qr.manager
                    .createQueryBuilder()
                    .insert()
                    .into('VPSInfo')
                    .values({
                        orderno: data.order,
                        item: data.packing,
                        itemseq: i + 1,
                        qty: data.qtyPrint,
                        pis,
                        ncopy: '1',
                        rdel: '0',
                        itemtype: '0',
                        printtype: '0',
                        printdate: now,
                    })
                    .execute();
            }

            await qr.manager
                .createQueryBuilder()
                .update('ItemQty')
                .set({ qty: data.qtyPrint })
                .where('ordrno = :order', { order: data.order })
                .andWhere('itemno = :packing', { packing: data.packing })
                .execute();

            await qr.manager
                .createQueryBuilder()
                .update('ItemQtyHistory')
                .set({ currnt: '0' })
                .where('pis = :piscode', { piscode: data.piscode })
                .execute();

            await qr.manager
                .createQueryBuilder()
                .insert()
                .into('ItemQtyHistory')
                .values({
                    pis: data.piscode,
                    qty: data.qtyPrint,
                    currnt: '1',
                    upuser: data.empno,
                    updte: now,
                })
                .execute();

            const cpd = await qr.manager
                .createQueryBuilder()
                .select('*')
                .from('PackingDetail', 'pd')
                .where('pd.orderno = :order', { order: data.order })
                .andWhere('pd.item = :packing', { packing: data.packing })
                .orderBy('pd.itemseq', 'ASC')
                .getRawMany();

            if (cpd.length > 0) {
                const base = cpd[0];

                await qr.manager
                    .createQueryBuilder()
                    .delete()
                    .from('PackingDetail')
                    .where('orderno = :order', { order: data.order })
                    .andWhere('item = :packing', { packing: data.packing })
                    .execute();

                for (let i = 0; i < data.qtyPrint; i++) {
                    await qr.manager
                        .createQueryBuilder()
                        .insert()
                        .into('PackingDetail')
                        .values({
                            orderno: base.orderno,
                            ordernoref: base.ordernoref,
                            block: base.block,
                            item: base.item,
                            qty: data.qtyPrint,
                            itemseq: i + 1,
                            itemtype: base.itemtype,
                            shortitem: base.shortitem,
                            rejectId: base.rejectId,
                            inpttype: base.inpttype,
                            inptby: data.empno,
                            inptdate: now,
                            inptdesc: base.inptdesc,
                            delflag: base.delflag,
                            completed: base.completed,
                        })
                        .execute();
                }
            }

            await qr.commitTransaction();
        } catch (error) {
            await qr.rollbackTransaction();
            throw error;
        } finally {
            await qr.release();
        }
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

    async getListOrder(packing: string): Promise<any[]> {
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
                LEFT JOIN PACKORDDTL p
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

    async getListOrder_88_89() {
        const sql = `SELECT SUBSTR(F_CPROD(M8K01), -3) AS SCHEDULE,mk.*,sm.*,p.*,sch.max_date,a.AGENT,pl.* FROM M008KP mk 
                JOIN S010MP sm ON mk.M8K03 = sm.S01M01 
                JOIN PACKORDDTL p ON mk.M8K03 = p.ORDERNO AND sm.S01M04 = p.PACKNO
                LEFT JOIN (SELECT NEXTWORKDAY(max(workid) , 1) AS max_date,schdnumber FROM AMECCALENDAR a group by schdnumber) sch ON sch.schdnumber = sm.S01M09
                LEFT JOIN AMECORDERS a ON sm.S01M01 = a.MFGNO
                LEFT JOIN ( 
	                SELECT pl.NFRMNO,pl.VORGNO,pl.CYEAR,pl.CYEAR2,pl.NRUNNO,ORDERNO,PACKNO,f.VREALAPV,f.CSTEPST,pl.STATUS as FORM_TYPE
					FROM WEBFORM.PKRN_LIST pl 
					LEFT JOIN WEBFORM.FLOW f ON  pl.NFRMNO = f.NFRMNO AND pl.VORGNO = f.VORGNO AND pl.CYEAR = f.CYEAR AND pl.CYEAR2 = f.CYEAR2 AND pl.NRUNNO = f.NRUNNO
					WHERE CSTEPNO = '10' AND CSTEPST = '5'
					GROUP BY pl.NFRMNO,pl.VORGNO,pl.CYEAR,pl.CYEAR2,pl.NRUNNO,ORDERNO,PACKNO,f.VREALAPV,f.CSTEPST,pl.STATUS
                )  pl ON sm.S01M01 = pl.ORDERNO AND sm.S01M04 = pl.PACKNO AND sm.S01M09 > '2026025'              
                WHERE SUBSTR(sm.S01M04,-2) IN ('88','89')
                AND mk.M8K01 >= '20250000'
                AND (
				      PRINTSTA = 0 
				      OR 
				      (PRINTSTA = 1 AND (sm.S01M18 IS NULL OR pl.ORDERNO IS NOT NULL))
				  )
                AND NOT EXISTS (
					    SELECT 1 FROM REV_CONFIRM rc 
					    WHERE rc.\"ORDER\" = sm.S01M01 
					    AND rc.PACKING = sm.S01M04 
					    AND rc.CYEAR2 = pl.CYEAR2 
					    AND rc.NRUNNO = pl.NRUNNO
                        AND rc.CONFIRM_AT IS NOT NULL
					)
                ORDER BY max_date DESC`;
        return await this.wk.query(sql);
    }

    async getOrderDetail(order: string, packing: string): Promise<any[]> {
        const sql = `
            SELECT 
                A.*, 
                B.LVAL, 
                S.*, 
                ao.PRODTYPE as PRODTYPE,
                ao.COUNTRY as COUNTRY,
                SUBSTR(F_CPROD(M8K01), -3) AS SCHEDULE,
                SUBSTR(F_CPROD(M8K01), -5) AS JUN, 
                M8K02,
                J2INO as PUR_CODE,
                ap.PACKSHOP,
                CASE WHEN U.MFGNO IS NOT NULL THEN 1 ELSE NULL END AS URGENT,
                avo.ORDERNUMBER
            FROM S011MP A
            LEFT JOIN (
                SELECT S11M01, S11M08, S11M02, S11M03, S11M04, LISTAGG(SUBSTR(S11M06, -3), '') WITHIN GROUP (ORDER BY S11M06) AS LVAL 
                FROM S011MP 
                WHERE S11M07 = 1
                GROUP BY S11M01, S11M08, S11M02, S11M03, S11M04, S11M09
            ) B ON A.S11M01 = B.S11M01 AND A.S11M02 = B.S11M02 AND A.S11M06 = B.S11M04
            JOIN S010MP S ON A.S11M01 = S.S01M01 AND A.S11M02 = S.S01M04
            JOIN M008KP M ON A.S11M01 = M.M8K03
            LEFT JOIN (SELECT DISTINCT J2CUS, J2DRAW, J2INO, J2DES FROM J002MP WHERE J2CUS = :1 AND J2SEQ != 0) j 
                ON j.J2CUS = A.S11M01 AND (j.J2DRAW = REPLACE(A.S11M06, ' ', '') OR J2DES = REPLACE(A.S11M06, ' ', ''))
            LEFT JOIN AMECORDERS ao ON ao.MFGNO = S.S01M01
            LEFT JOIN AMECORDERS_PACKNO ap ON ap.ORDERNO = S.S01M01 AND ap.PACKNO = S.S01M04
            LEFT JOIN AMECVPCORDER avo ON avo.MFGNO = S.S01M01
            LEFT JOIN (
                SELECT MFGNO
                FROM WEBFORM.URGENT_ORDER_LIST A
                JOIN WEBFORM.FORM B ON A.NFRMNO = B.NFRMNO AND A.VORGNO = B.VORGNO AND A.CYEAR = B.CYEAR AND A.CYEAR2 = B.CYEAR2 AND A.NRUNNO = B.NRUNNO
                WHERE B.CST != 3
            ) U ON U.MFGNO = S.S01M01
            WHERE A.S11M01 = :2 
            AND A.S11M02 = :3 
            AND A.S11M07 = 0
            ORDER BY A.S11M03, A.S11M06 ASC
        `;

        return await this.wk.query(sql, [order, order, packing]);
    }

    async getQ46054OL(order: string, packing: string): Promise<any[]> {
        const sql = `SELECT * FROM RTNLIBF.Q46054OL WHERE Q46O01 = '${order}' AND Q46O02 = '${packing}'`;
        // หาก query ชุดนี้ต้องการดึงจาก AS400 Connection สามารถเปลี่ยนจาก this.wk เป็น DataSource ของ AS400 ที่ Inject เอาไว้ได้เลย
        return await this.as400.runQuery(sql);
    }

    async getOriginalOrder(order: string, item: string): Promise<any[]> {
        const sql = `SELECT DISTINCT(Q47K01) FROM Q147KP WHERE Q47K18 = :1 AND Q47K02 = :2`;
        return await this.wk.query(sql, [order, item]);
    }

    async getMasterPacking(dwgNo: string): Promise<any[]> {
        // สมมติชื่อ Table เป็น MASTER_PACKING รบกวนตรวจสอบชื่อ Table หรือ Store Procedure อีกทีหากมีการเรียกใช้โครงสร้างอื่นครับ
        const sql = `SELECT * FROM MASTER_PACKLIST WHERE DWGNO = :1`;
        return await this.wk.query(sql, [dwgNo]);
    }

    // Repository
    async insertCartonBox(items: InsertCartonDto[]) {
        const qr = this.wk.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            const uniqueKeys = new Map<
                string,
                { ORDER_NO: string; PACKING_NO: string }
            >();
            for (const item of items) {
                const key = `${item.ORDER_NO}|${item.PACKING_NO}`;
                if (!uniqueKeys.has(key)) {
                    uniqueKeys.set(key, {
                        ORDER_NO: item.ORDER_NO,
                        PACKING_NO: item.PACKING_NO,
                    });
                }
            }

            for (const { ORDER_NO, PACKING_NO } of uniqueKeys.values()) {
                await qr.manager
                    .createQueryBuilder()
                    .update(PKC_CARTON_DETAIL)
                    .set({ STATUS: 0 })
                    .where('ORDER_NO = :orderNo', { orderNo: ORDER_NO })
                    .andWhere('PACKING_NO = :packingNo', {
                        packingNo: PACKING_NO,
                    })
                    .execute();
            }

            const result = await qr.manager
                .getRepository(PKC_CARTON_DETAIL)
                .insert(items);

            await qr.commitTransaction();
            return result;
        } catch (error) {
            await qr.rollbackTransaction();
            throw error;
        } finally {
            await qr.release();
        }
    }

    async getOrderReprint(
        search: string | undefined,
        page: number,
        sect: string,
    ) {
        const PAGE_SIZE = 20;
        const skip = (page - 1) * PAGE_SIZE;
        const searchVal = search ?? null;
        const isAllSect = sect?.toUpperCase() === 'ALL';

        const sectFilter = isAllSect
            ? ''
            : `
        AND EXISTS (
            SELECT 1 FROM AMECORDERS_PACKNO a
            WHERE a.PACKNO = p.PACKNO
            AND (a.SECT = :3 OR a.SECT_PACKING = :4)
        )`;

        const params = isAllSect
            ? [searchVal, searchVal, skip, PAGE_SIZE + 1]
            : [searchVal, searchVal, sect, sect, skip, PAGE_SIZE + 1];

        // ต้องปรับเลข placeholder ของ OFFSET/FETCH ให้ตรงกับจำนวนพารามิเตอร์ที่ใช้จริง
        const offsetIdx = isAllSect ? 3 : 5;
        const fetchIdx = isAllSect ? 4 : 6;

        const rows = await this.wk.query(
            `
            SELECT ORDERNO
            FROM (
                SELECT DISTINCT p.ORDERNO
                FROM PACKORDDTL p
                WHERE p.PRINTSTA = '1'
                AND (:1 IS NULL OR UPPER(p.ORDERNO) LIKE UPPER('%' || :2 || '%'))
                ${sectFilter}
            )
            ORDER BY ORDERNO
            OFFSET :${offsetIdx} ROWS FETCH NEXT :${fetchIdx} ROWS ONLY
            `,
            params,
        );

        const hasMore = rows.length > PAGE_SIZE;
        const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

        return { rows: items, hasMore };
    }

    async getPackNoReprint(orderno: string, sect: string) {
        const isAllSect = sect?.toUpperCase() === 'ALL';

        const sectFilter = isAllSect
            ? ''
            : `
        AND EXISTS (
            SELECT 1 FROM AMECORDERS_PACKNO a
            WHERE a.PACKNO = p.PACKNO
            AND (a.SECT = :2 OR a.SECT_PACKING = :3)
        )`;

        const params = isAllSect ? [orderno] : [orderno, sect, sect];

        return this.wk.query(
            `
            SELECT DISTINCT p.PACKNO, p.ITEMNO, p.PARTNAME
            FROM PACKORDDTL p
            WHERE p.PRINTSTA = '1'
            AND p.ORDERNO = :1
            ${sectFilter}
            ORDER BY p.PACKNO
            `,
            params,
        );
    }

    async getDataCartonBox() {
        return this.wk
            .createQueryBuilder()
            .select('*')
            .from('PKC_PRODUCTS', 'p')
            .where('ITEM_STATUS = 1')
            .andWhere('ID = 3')
            .andWhere('SPRODID IS NOT NULL')
            .orderBy('SPRODID', 'ASC')
            .getRawMany();
    }

    async getSpecialCarton() {
        return this.wk
            .createQueryBuilder()
            .select('CARTON_NAME as SPRODID')
            .from('SPECIAL_CARTON', 's')
            .where('SC_STATUS = 1')
            .getRawMany();
    }
}
