import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
@Injectable()
export class S030kpService {
    constructor(private conn: ConectionService) {}

    async plHeader(order: string) {
        const result = await this.conn.runQuery(
            `SELECT 
                S03K01 AS VORDERNO, 
	            SUBSTR(S03K01,1,1) || '-' || SUBSTR(S03K01,2,2) || '-' || SUBSTR(S03K01,4,5) || '-' || SUBSTR(S03K01,9,1) AS VSHOPORDERNO,
                S03K02||' ('||S03K03||')'||S03K04 AS VSUBJECT,
                S03K05 AS VNAMEOFBLDG,
                S03K05 AS VSOLDTO,
                COUNT(*) AS TOTAL_PACKAGES
            FROM RTNLIBF.S030KP
            WHERE S03K01 = '${order}'
            GROUP BY 
            S03K01,
            S03K02,
            S03K03,
            S03K04,
            S03K05`,
        );
        return result;
    }
}
