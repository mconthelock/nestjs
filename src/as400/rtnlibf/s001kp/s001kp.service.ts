import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

@Injectable()
export class S001kpService {
    constructor(private conn: ConectionService) {}
    async packinglist(mfgno: string) {
        const result = await this.conn.runQuery(
            `SELECT 
                A.S01K01 AS VMFGNO,
                A.S01K03 AS VCASE, 
                A.S01K02 AS VITEM, 
                COALESCE(B.S11M05, C.S11M05 ) AS VPART,
                A.S01K04 AS VDRAWING, 
                Q.VDRAWINGL,
                A.S01K05 AS NQTY
            FROM RTNLIBF.S001KP A
            LEFT JOIN RTNLIBF.S011MP B ON A.S01K01 = B.S11M01 AND A.S01K02 = B.S11M02 AND A.S01K04 = B.S11M06
            LEFT JOIN (
                    SELECT * FROM RTNLIBF.S020KP A
                    JOIN RTNLIBF.S011MP B ON A.S20K01 = B.S11M01 AND A.S20K02 = B.S11M02
            ) C ON A.S01K01 = C.S20K03 AND A.S01K02 = C.S20K02 AND A.S01K04 = C.S11M06
            LEFT JOIN (
                SELECT Q42K01, Q42K02, Q42K03, Q42K04,
                LISTAGG(DISTINCT Q42K05, '')
                        WITHIN GROUP (ORDER BY Q42K05) AS VDRAWINGL
                FROM RTNLIBF.Q142KL01
                GROUP BY Q42K01, Q42K02, Q42K03, Q42K04
            ) Q ON (A.S01K01 = Q.Q42K01 OR C.S20K01 = Q.Q42K01) AND A.S01K04 = Q.Q42K04 
            WHERE A.S01K01 = '${mfgno}'
            ORDER BY A.S01K01, A.S01K03, A.S01K02, A.S01K04 ASC`,
        );
        return result;
    }
}
