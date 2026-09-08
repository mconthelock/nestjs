import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

@Injectable()
export class WireHarnessAs400Repository {
    constructor(
        private readonly as400: ConectionService,
    ) {}

    getProductionPlan() {
        return this.as400.runQuery(`
            SELECT * 
            FROM 
            (
                SELECT
                    F1.F01R01 AS CTRLNO,
                    F2.F02R03 AS PROCESS,
                    S.M8K01 AS PROD,
                    S.M8K02 AS P,
                    S.M8K03 AS MFGNO,
                    F1.F01R08 AS PROJ,
                    Q9.Q9TYP AS MODEL,
                    F1.F01R04 AS DWG,
                    F1.F01R10 AS QTY,
                    CB.Q41K14 AS MATERIAL,
                    CB.Q41K20 AS ITEMCODE,
                    DECIMAL(CB.Q41K16, 8, 0) / 1000 AS CUT,
                    Q3.Q43K06 AS REMARK,
                    ROW_NUMBER() OVER (PARTITION BY F1.F01R01 ORDER BY CB.Q41K05) AS RN
                FROM RTNLIBF.M008KP S
                JOIN RTNLIBF.Q90010P2 Q9
                    ON S.M8K03 = Q9.Q9ORD
                JOIN SHOPF.F001KP F1
                    ON S.M8K03 = F1.F01R07
                JOIN SHOPF.F002KP F2
                    ON F1.F01R01 = F2.F02R01
                JOIN RTNLIBF.Q141KP Q1
                    ON F1.F01R07 = Q1.Q41K01
                    AND F1.F01R04 = Q1.Q41K08
                LEFT JOIN RTNLIBF.Q141KP CB
                    ON Q1.Q41K01 = CB.Q41K01
                    AND Q1.Q41K02 = CB.Q41K02
                    AND Q1.Q41K03 = CB.Q41K03
                    AND Q1.Q41K04 = CB.Q41K04
                    AND CB.Q41K10 LIKE 'CABLE%'
                    AND SUBSTR(Q1.Q41K08, 1, LOCATE(' ', Q1.Q41K08 || ' ') - 1) = SUBSTR(CB.Q41K08, 1, LOCATE(' ', CB.Q41K08 || ' ') - 1)
                LEFT JOIN RTNLIBF.Q143KP Q3
                    ON Q1.Q41K01 = Q3.Q43K01
                    AND Q1.Q41K02 = Q3.Q43K02
                    AND Q1.Q41K03 = Q3.Q43K03
                    AND Q1.Q41K04 = Q3.Q43K04
                    AND Q1.Q41K05 = Q3.Q43K05
                WHERE F2.F02R03 = 'B4CC06'
                AND S.M8K01 >= VARCHAR_FORMAT(CURRENT DATE - 1 MONTH, 'YYYYMM')
            ) X
            WHERE X.RN = 1
        `);
    }
}