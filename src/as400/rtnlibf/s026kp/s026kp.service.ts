import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

@Injectable()
export class S026kpService {
    constructor(private conn: ConectionService) {}

    async shippingMark(projno: string) {
        const result = await this.conn.runQuery(
            `SELECT
                PROJCT,
                RTRIM(
                    COALESCE(CASE WHEN TRIM(MRKLN1) <> '' THEN TRIM(MRKLN1) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN2) <> '' THEN TRIM(MRKLN2) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN3) <> '' THEN TRIM(MRKLN3) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN4) <> '' THEN TRIM(MRKLN4) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN5) <> '' THEN TRIM(MRKLN5) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN6) <> '' THEN TRIM(MRKLN6) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN7) <> '' THEN TRIM(MRKLN7) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN8) <> '' THEN TRIM(MRKLN8) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN9) <> '' THEN TRIM(MRKLN9) || '|' END, '') ||
                    COALESCE(CASE WHEN TRIM(MRKLN0) <> '' THEN TRIM(MRKLN0) || '|' END, '')
                , '|') AS SHIPPING_MARK
            FROM RTNLIBF.S026KP WHERE PROJCT = '${projno}'`,
        );
        return result;
    }
}
