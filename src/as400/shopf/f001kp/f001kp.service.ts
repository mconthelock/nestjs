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
        // 1. แปลงให้เป็น Array เสมอ (ถ้าส่งมาตัวเดียวก็จับใส่ [] ถ้าเป็น Array อยู่แล้วก็ใช้ได้เลย)
        const dwgArray = Array.isArray(dwgNo) ? dwgNo : [dwgNo];

        // 2. วนลูปสร้างเงื่อนไข LIKE และเชื่อมด้วย OR
        const dwgConditions = dwgArray
            // แนะนำให้ใส่ TRIM() ป้องกันปัญหาเคาะวรรค (Space) ท้ายข้อความในฐานข้อมูล AS400
            .map((dwg) => `TRIM(F01R04) LIKE '${dwg}%'`)
            .join(' OR ');

        // 3. นำเงื่อนไขที่ได้มาประกอบร่างใน SQL
        let sql = `
            SELECT
                F01R04,
                F01R09,
                F01R03,
                SUM(F01R10) AS QTY
            FROM SHOPF.F001KP
            WHERE TRIM(F01R02) LIKE '${month}%'
              AND (${dwgConditions})
            GROUP BY
                F01R04,
                F01R09,
                F01R03
        `;
        const res = await this.conn.runQuery(sql);
        if (!res || res.length === 0) {
            return [];
        }
        const finalData = await Promise.all(
            res.map(async (row) => {
                // เอา F01R04 ของแต่ละแถวมาตัดช่องว่าง (Space) ออก เพื่อความชัวร์ในการ Query
                const currentDwgNo = row.F01R04.trim();

                const processSql = `
                    SELECT DISTINCT F02R03, F02R04, F02R05
                    FROM SHOPF.F001KP A
                    JOIN SHOPF.F002KP B ON A.F01R01 = B.F02R01
                    WHERE TRIM(F01R02) LIKE '${month}%'
                      AND TRIM(F01R04) LIKE '${currentDwgNo}%'
                    ORDER BY F02R03 DESC
                `;

                // สั่งรัน Query หา Process ของ Row นี้
                const processRes = await this.conn.runQuery(processSql);

                // คืนค่าโครงสร้าง Object กลับไป
                return {
                    F01R04: row.F01R04,
                    F01R09: row.F01R09,
                    F01R03: row.F01R03,
                    QTY: row.QTY,
                    PROCESS: processRes, // นำผลลัพธ์ที่ได้ไปใส่ใน Array ชื่อ process
                };
            }),
        );

        // 4. ส่งผลลัพธ์สุดท้ายกลับไปให้ Frontend
        return finalData;

        //return await this.conn.runQuery(sql);
    }
}
