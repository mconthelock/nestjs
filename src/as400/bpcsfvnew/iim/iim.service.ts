import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

@Injectable()
export class IimService {
    constructor(private conn: ConectionService) {}
    async priceComparison({
        FUNC,
        ITEM,
    }: {
        FUNC: number;
        ITEM: string | string[];
    }) {
        const result = await this.conn.runQuery(
            `
            SELECT 
                A.*,
                (A.NQUANTITY_YEAR * A.NPRES_PRICE_ETA_AMEC) / 1000 AS NPRES_AMOUNT
            FROM (
                SELECT 
                    I.FUNCTIONS AS NFUNCTIONS,
                    TRIM(I.IPFDV) AS VJOB_ITEMNO,
                    TRIM(I.IDESC) AS VPART_NAME,
                    TRIM(I.IDRAW) AS VDRAWING,
                    TRIM(I.IPROD) AS VITEM_CODE,
                    TRIM(I.IGLNO) AS VSPEC,
                    TRIM(I.ISITM) AS VMATERIAL_CODE,
                    CASE WHEN J.QUANTITY_YEAR <= 0 THEN 1 ELSE J.QUANTITY_YEAR END NQUANTITY_YEAR,
                    TRIM(I.IVEND) AS VPRES_VENDOR,
                    TRIM(A.VNDNAM) AS VPRES_VENDOR_NAME,
                    CASE WHEN TRIM(I2.IMKNM1) = '' THEN NULL ELSE I2.IMKNM1 END VPRES_MAKER,
                    CASE WHEN I.FUNCTIONS = 3 THEN NULL ELSE K.K26PRC END AS NPRES_BASE_PRICE,
                    CASE WHEN I.FUNCTIONS = 3 THEN NULL ELSE K.K26CUR END AS VPRES_BASE_CURR,
                    CASE WHEN I.FUNCTIONS = 3 THEN NULL ELSE K.BASE_CURRENCY END AS NPRES_BASE_CURRENCY,
                    CASE WHEN I.FUNCTIONS = 3 THEN NULL ELSE H.HQPR1 END AS NPRES_PRICE,
                    CASE WHEN I.FUNCTIONS = 3 THEN NULL ELSE H.HQCURR END AS VPRES_PRICE_CURR,
                    CASE WHEN I.FUNCTIONS = 3 THEN NULL ELSE H.CURRENCY END AS NPRES_PRICE_CURRENCY,
                    CASE WHEN I.FUNCTIONS = 1      THEN K.K26PRC * K.BASE_CURRENCY
                        WHEN I.FUNCTIONS IN (2,3) THEN H.HQPR1 
                        WHEN I.FUNCTIONS IN (4,5) THEN H.HQPR1 * H.CURRENCY 
                    END AS NPRES_PRICE_ETA_AMEC
                FROM (SELECT ${FUNC} AS FUNCTIONS, I.* FROM BPCSFVNEW.IIM I) I
                LEFT JOIN BPCSFVNEW.AVM A ON A.VENDOR = I.IVEND
                LEFT JOIN (
                    SELECT 
                        A07#01 AS ITEM_CODE,
                        A07#03 + A07#04 + A07#05 + A07#06 + A07#07 + A07#08 + A07#09 + A07#10 + A07#11 + A07#12 + A07#13 + A07#14 AS QUANTITY_YEAR
                    FROM RTNLIBF.J271KP
                ) J ON I.IPROD = J.ITEM_CODE
                LEFT JOIN BPCSFVNEW.IIM2 I2 ON I2.IPROD = I.IPROD
                LEFT JOIN (
                    SELECT K26.*, NVL(K89.CURRENCY,1) AS BASE_CURRENCY
                    FROM RTNLIBF.K026KP K26
                    LEFT JOIN (
                        SELECT 
                            K89#01 AS CURRNAME, 
                            CASE WHEN K89#02 = '/' THEN 1/K89#03
                                ELSE K89#03
                            END AS CURRENCY
                        FROM RTNLIBF.K089KP 
                    ) K89 ON K26.K26CUR = K89.CURRNAME
                ) K ON I.IPROD = K.K26ITM AND I.IVEND = K.K26VND 
                LEFT JOIN (
                    SELECT 
                        HQPROD, HQVEND, HQPR1, HQCURR, NVL(K.CURRENCY,1) AS CURRENCY
                    FROM BPCSFVNEW.HQT H
                    LEFT JOIN (
                        SELECT 
                            K89#01 AS CURRNAME, 
                            CASE WHEN K89#02 = '/' THEN 1/K89#03
                                ELSE K89#03
                            END AS CURRENCY
                        FROM RTNLIBF.K089KP 
                    ) K ON H.HQCURR = K.CURRNAME
                ) H ON H.HQPROD = I.IPROD AND H.HQVEND = I.IVEND
            ) A
            WHERE VITEM_CODE ${Array.isArray(ITEM) ? `IN (${ITEM.map((code) => `'${code}'`).join(',')})` : `= '${ITEM}'`}`,
        );
        return result;
    }

    async findPlannerCompareSheet(planner: string | string[]) {
        const result = await this.conn.runQuery(`
                SELECT 
                    I.IBUYC AS VPLANNER_CODE,
                    TRIM(I.IPROD) AS VITEM_CODE,
                    TRIM(I.IDRAW) AS VDRAWING,
                    TRIM(I.IDESC) AS VPART_NAME,
                    TRIM(I.IGLNO) AS VSPEC,
                    TRIM(I.ISITM) AS VMATERIAL_CODE,
                    I.IVEND AS VPRES_VENDOR,
                    A.VNDNAM AS VPRES_VENDOR_NAME
                FROM BPCSFVNEW.IIM I
                LEFT JOIN BPCSFVNEW.AVM A ON A.VENDOR = I.IVEND 
                WHERE I.IITYP IN ('1','3')
                AND IID = 'IM'
                AND I.IBUYC ${Array.isArray(planner) ? `IN (${planner.map((code) => `'${code}'`).join(',')})` : `= '${planner}'`}
                ORDER BY I.IBUYC, I.IPROD, I.IDRAW, I.IVEND
            `);
        return result;
    }
}
