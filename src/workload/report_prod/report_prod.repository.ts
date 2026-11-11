import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportProdRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private readonly wk: DataSource,
    ) {
        super(wk);
    }

    private getBoundaryEndMonth(endMonth: string): string {
        let endYear = Number(endMonth.slice(0, 4));
        let nextMonth = Number(endMonth.slice(4, 6)) + 1;
        if (nextMonth > 12) {
            nextMonth = 1;
            endYear++;
        }
        return `${endYear}${String(nextMonth).padStart(2, '0')}`;
    }

    getOutputProdHistory(startMonth: string, endMonth: string) {
        return this.manager.query(
            `SELECT
                    PROD_MONTH,
                    F_TYPE_NAME(ORDTYPE) AS TYP,
                    F_TYPE_PRIORITY(ORDTYPE) AS PRIORITY,
                    E_BM,
                    E_ACC,
                    E_BM - E_ACC AS E_REM,
                    S_BM,
                    S_ACC,
                    S_BM - S_ACC AS S_REM
                FROM (
                    SELECT
                        PROD_MONTH,
                        ORDTYPE,
                        NVL(SUM(CASE WHEN MFG = 'E' THEN BM END), 0) AS E_BM,
                        NVL(SUM(CASE WHEN MFG = 'E' THEN ACC END), 0) AS E_ACC,
                        NVL(SUM(CASE WHEN MFG = 'S' THEN BM END), 0) AS S_BM,
                        NVL(SUM(CASE WHEN MFG = 'S' THEN ACC END), 0) AS S_ACC
                    FROM (
                        SELECT
                            SUBSTR(PROD, 1, 6) AS PROD_MONTH,
                            SUBSTR(ORDERNO, 1, 1) AS MFG,
                            CASE
                                WHEN PRODTYPE IN ('ESC', 'ELE') THEN 'MAIN'
                                ELSE PRODTYPE
                            END AS ORDTYPE,
                            COUNT(*) AS BM,
                            SUM(
                                CASE
                                    WHEN ACCEPT_MFGDATE IS NULL THEN 0
                                    ELSE 1
                                END
                            ) AS ACC
                        FROM DPMS_ORDERS_VIEW
                        WHERE PRODTYPE IN ('ELE', 'ESC', 'DUM', 'SUP', 'REC', 'TR')
                        AND REVISION != 'D'
                        AND SUBSTR(PROD, 1, 6) >= :1
                        AND SUBSTR(PROD, 1, 6) <= :2
                        GROUP BY
                            SUBSTR(PROD, 1, 6),
                            SUBSTR(ORDERNO, 1, 1),
                            CASE
                                WHEN PRODTYPE IN ('ESC', 'ELE') THEN 'MAIN'
                                ELSE PRODTYPE
                            END
                    )
                    GROUP BY PROD_MONTH, ORDTYPE
                )
                ORDER BY PROD_MONTH, F_TYPE_PRIORITY(ORDTYPE)`,
            [startMonth, endMonth],
        );
    }

    getFinishProdHistory(startMonth: string, endMonth: string) {
        const boundaryEnd = this.getBoundaryEndMonth(endMonth);

        return this.manager.query(
            `WITH MONTH_BOUNDARY AS (
                SELECT
                    WORKYEAR,
                    WORKMONTH,
                    WORKYEAR || LPAD(WORKMONTH, 2, '0') AS PROD_MONTH,
                    MIN(CASE
                        WHEN DAYOFF = 0 THEN WORKID
                    END) AS FIRST_WORKDAY
                FROM AMECCALENDAR
                WHERE WORKYEAR || LPAD(WORKMONTH, 2, '0')
                    BETWEEN :1 AND :2
                GROUP BY
                    WORKYEAR,
                    WORKMONTH
            ),
            MONTH_RANGE AS (
                SELECT
                    PROD_MONTH,
                    FIRST_WORKDAY,

                    LEAD(FIRST_WORKDAY) OVER (
                        ORDER BY WORKYEAR, WORKMONTH
                    ) - 1 AS LAST_WORKDAY

                FROM MONTH_BOUNDARY
            )
            SELECT
                mr.PROD_MONTH,
                mr.FIRST_WORKDAY,
                mr.LAST_WORKDAY,
                COUNT(dov.MFG_WORKDAY) AS CNT
            FROM MONTH_RANGE mr
            LEFT JOIN DPMS_ORDERS_VIEW dov
                ON dov.MFG_WORKDAY BETWEEN mr.FIRST_WORKDAY AND mr.LAST_WORKDAY
                AND dov.PRODTYPE IN ('ELE', 'ESC')
            WHERE mr.PROD_MONTH BETWEEN :3 AND :4
            GROUP BY
                mr.PROD_MONTH,
                mr.FIRST_WORKDAY,
                mr.LAST_WORKDAY
            ORDER BY mr.PROD_MONTH`,
            [startMonth, boundaryEnd, startMonth, endMonth],
        );
    }

    getCountFinishDelayHistory(startMonth: string, endMonth: string) {
        const boundaryEnd = this.getBoundaryEndMonth(endMonth);

        return this.manager.query(
            `WITH MONTH_BOUNDARY AS (
                SELECT
                    WORKYEAR,
                    WORKMONTH,
                    WORKYEAR || LPAD(WORKMONTH, 2, '0') AS PROD_MONTH,
                    MIN(CASE
                        WHEN DAYOFF = 0 THEN WORKID
                    END) AS FIRST_WORKDAY
                FROM AMECCALENDAR
                WHERE WORKYEAR || LPAD(WORKMONTH, 2, '0')
                    BETWEEN :1 AND :2
                GROUP BY
                    WORKYEAR,
                    WORKMONTH
            ),
            MONTH_RANGE AS (
                SELECT
                    PROD_MONTH,
                    LEAD(FIRST_WORKDAY) OVER (
                        ORDER BY WORKYEAR, WORKMONTH
                    ) AS FIRST_WORKDAY_NEXT
                FROM MONTH_BOUNDARY
            )
            SELECT
                mr.PROD_MONTH,
                COUNT(dov.MFGBM_NO) AS CNT
            FROM MONTH_RANGE mr
            LEFT JOIN DPMS_ORDERS_VIEW dov
                ON dov.PRODTYPE IN ('ELE', 'ESC')
                AND dov.REVISION != 'D'
                AND dov.MFGBM_NO <= mr.PROD_MONTH || '6'
                AND (
                    dov.MFG_WORKDAY IS NULL
                    OR dov.MFG_WORKDAY >= mr.FIRST_WORKDAY_NEXT
                )
            WHERE mr.PROD_MONTH BETWEEN :3 AND :4
            GROUP BY mr.PROD_MONTH
            ORDER BY mr.PROD_MONTH`,
            [startMonth, boundaryEnd, startMonth, endMonth],
        );
    }
}
