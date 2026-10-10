import { Injectable } from '@nestjs/common';
import { ConectionService } from '../../conection/conection.service';
@Injectable()
export class F001kpService {
    constructor(private conn: ConectionService) {}

    async findOne() {
        const result = await this.conn.runQuery(
            `SELECT * FROM RTNLIBF.Q90010P2 Q9 JOIN SHOPF.F003KP F3 ON Q9ORD = F3.F03R02 WHERE Q9PP = 20250710`,
        );
        return result;
        // FETCH FIRST 10 ROWS ONLY
    }
    async findTsAdjustData(month: string, dwgNo: string | string[]) {
        // month = '202609'
        // dwgNo = 'BA004A565 G91 L13'
        const dwgArray = Array.isArray(dwgNo) ? dwgNo : [dwgNo];
        const dwgConditions = dwgArray
            .map((dwg) => `TRIM(A.F01R05) LIKE '${dwg}%'`)
            .join(' OR ');

        let sql = `
            SELECT
                M.M8K01, M.M8K02, A.F01R01, A.F01R03, A.F01R04, A.F01R09,
                B.F02R02, B.F02R03, S.F03M02, B.F02R04, B.F02R05, B.F02R06, B.F02R07, A.F01R10
            FROM SHOPF.F001KP A
            LEFT JOIN SHOPF.F002KP B ON A.F01R01 = B.F02R01
            LEFT JOIN RTNLIBF.M008KP M ON A.F01R07 = M.M8K03
            LEFT JOIN SHOPF.F003MP S ON S.F03M01 = SUBSTR(B.F02R03, 1, 2)
            WHERE TRIM(A.F01R02) LIKE '${month}%'
              AND (${dwgConditions})
        `;

        return await this.conn.runQuery(sql);
    }
}
