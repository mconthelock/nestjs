import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

@Injectable()
export class k089kpService {
    constructor(private conn: ConectionService) {}
    async currency() {
        const result = await this.conn.runQuery(
            `SELECT 
                K89#01 AS CURRNAME, 
                CASE WHEN K89#02 = '/' THEN 1/K89#03
                    ELSE K89#03
                END AS CURRENCY
            FROM RTNLIBF.K089KP K`,
        );
        return result;
    }
}
