import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EKittingRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private readonly wk: DataSource,
    ) {
        super(wk);
    }

    search(order,packing) {
        const result = this.manager.query(
            `WITH BASE AS (
                SELECT B.S11M06,
                    Q.Q41K01, Q.Q41K03, B.S11M02, Q.Q41K04, Q.Q41K07, A.S01M08,
                    TO_NUMBER(Q.Q41K05) AS BASE_SEQ,
                    TO_NUMBER(Q.Q41K06) AS BASE_LVL
                FROM S010MP A
                JOIN S011MP B
                    ON A.S01M01 = B.S11M01
                    AND A.S01M04 = B.S11M02
                JOIN Q141KP Q
                    ON Q.Q41K01 = A.S01M01
                    AND Q.Q41K03 = A.S01M06
                    AND Q.Q41K08 = B.S11M06
                WHERE B.S11M01 LIKE :1
                AND B.S11M02 = :2
                AND B.S11M07 = '0'
            ),
            RNG AS (
                SELECT BASE.*,
                    NVL((SELECT MIN(TO_NUMBER(X.Q41K05))
                            FROM Q141KP X
                            WHERE X.Q41K01 = BASE.Q41K01
                            AND X.Q41K03 = BASE.Q41K03
                            AND X.Q41K04 = BASE.Q41K04
                            AND X.Q41K07 = BASE.Q41K07
                            AND TO_NUMBER(X.Q41K05) > BASE.BASE_SEQ
                            AND TO_NUMBER(X.Q41K06) <= BASE.BASE_LVL), 999999) AS END_SEQ
                FROM BASE
            ),
            ALL_ROWS AS (
                SELECT R.S11M06, R.S11M02, R.S01M08,
                    CASE WHEN TO_NUMBER(Q.Q41K05) = R.BASE_SEQ THEN 'L' ELSE 'L+1' END AS ROW_TYPE,
                    Q.*,
                    ROW_NUMBER() OVER (
                        PARTITION BY Q.Q41K01, Q.Q41K03, Q.Q41K04, Q.Q41K07, TO_NUMBER(Q.Q41K05)
                        ORDER BY CASE WHEN TO_NUMBER(Q.Q41K05) = R.BASE_SEQ THEN 0 ELSE 1 END
                    ) AS RN
                FROM RNG R
                JOIN Q141KP Q
                    ON Q.Q41K01 = R.Q41K01
                    AND Q.Q41K03 = R.Q41K03
                    AND Q.Q41K04 = R.Q41K04
                    AND Q.Q41K07 = R.Q41K07
                    AND (   TO_NUMBER(Q.Q41K05) = R.BASE_SEQ
                        OR (    TO_NUMBER(Q.Q41K05) > R.BASE_SEQ
                            AND TO_NUMBER(Q.Q41K05) < R.END_SEQ
                            AND TO_NUMBER(Q.Q41K06) = R.BASE_LVL + 1))
            )
            SELECT A.*
            FROM ALL_ROWS A
            WHERE A.RN = 1
            ORDER BY A.Q41K01, A.Q41K03, A.Q41K04, A.Q41K07, TO_NUMBER(A.Q41K05)`
            , [`_${order}_`, packing]
        );
        return result;
    }
}
