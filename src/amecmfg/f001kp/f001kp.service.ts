import { Injectable } from '@nestjs/common';
import { ConectionService } from '../../as400/conection/conection.service';
import { IETS_LIST } from 'src/common/Entities/webform/table/IETS_LIST.entity';
import { IetsListRepository } from 'src/webform/ieform/ie-ts/iets_list/iets_list.repository';
import { formatDate } from 'src/common/utils/dayjs.utils';

@Injectable()
export class F001kpService {
    constructor(
        private conn: ConectionService,
        private readonly repo: IetsListRepository,
    ) {}

    async findOne() {
        const result = await this.conn.runQuery(
            `SELECT * FROM RTNLIBF.Q90010P2 Q9 JOIN SHOPF.F003KP F3 ON Q9ORD = F3.F03R02 WHERE Q9PP = 20250710`,
        );
        return result;
        // FETCH FIRST 10 ROWS ONLY
    }

    // ใน F001kpService.findTsAdjustData ปรับปรุงใหม่

    async findTsAdjustData(month: string, dwgNo: string | string[]) {
        const dwgArray = Array.isArray(dwgNo) ? dwgNo : [dwgNo];

        const dwgConditions = dwgArray.map((dwg) => `TRIM(F01R04) LIKE '${dwg}%'`).join(' OR ');

        // 1. ดึงข้อมูลหลัก
        const sql = `
        SELECT F01R04, F01R09, F01R03, SUM(F01R10) AS QTY
        FROM SHOPF.F001KP
        WHERE TRIM(F01R02) LIKE '${month}%' AND (${dwgConditions})
        GROUP BY F01R04, F01R09, F01R03
    `;
        const res = await this.conn.runQuery(sql);
        if (!res || res.length === 0) return [];

        // ดึง DwgNo ทั้งหมดจากผลลัพธ์มาเก็บเป็น Array ไม่ซ้ำกัน (Unique)
        const allDwgNos = [...new Set(res.map((row) => row.F01R04.trim()))];
        const currentDateString = new Date().toISOString().split('T')[0];

        // 2. ดึง History ทั้งหมดใน 1 Query
        const allHistories = await this.repo.getLatestRequestsByDwgNos(
            allDwgNos,
            currentDateString,
        );
        // แปลงเป็น Object เพื่อให้ค้นหาได้เร็ว [ 'DWG1': { ... }, 'DWG2': { ... } ]
        const historyMap = allHistories.reduce((acc, curr) => {
            const key = curr.DWGNO.trim();
            acc[key] = curr;
            return acc;
        }, {});
        console.log('HHHHHHHHHHHHH');
        console.log(historyMap);
        console.log('HHHHHHHHHHHHH');
        // 3. ดึง Process ทั้งหมดใน 1 Query
        // สร้างเงื่อนไข IN สำหรับ DwgNo
        const dwgInClause = allDwgNos.map((d) => `'${d}'`).join(',');
        const processSql = `
        SELECT DISTINCT TRIM(A.F01R04) AS F01R04, F02R03, F02R04, F02R05
        FROM SHOPF.F001KP A
        JOIN SHOPF.F002KP B ON A.F01R01 = B.F02R01
        WHERE TRIM(A.F01R02) LIKE '${month}%'
          AND TRIM(A.F01R04) IN (${dwgInClause})
        ORDER BY F02R03 DESC
    `;
        const allProcesses = await this.conn.runQuery(processSql);

        // จัดกลุ่ม Process ตาม DwgNo
        const processMap = allProcesses.reduce((acc, curr) => {
            const dwg = curr.F01R04;
            if (!acc[dwg]) acc[dwg] = [];
            acc[dwg].push(curr);
            return acc;
        }, {});

        // 4. นำข้อมูลมา Map รวมกัน (ไม่ต้องยิง Database แล้ว!)
        const finalData = res.map((row) => {
            const currentDwgNo = row.F01R04.trim();
            return {
                F01R04: row.F01R04,
                F01R09: row.F01R09,
                F01R03: row.F01R03,
                QTY: row.QTY,
                PROCESS: processMap[currentDwgNo] || [], // ดึงจาก Memory Map
                HISTORY: historyMap[currentDwgNo]?.MAXAPVDATE
                    ? formatDate(historyMap[currentDwgNo].MAXAPVDATE)
                    : null, // ดึงจาก Memory Map
            };
        });

        return finalData;
    }
}
