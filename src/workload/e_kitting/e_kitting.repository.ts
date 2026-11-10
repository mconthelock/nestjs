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
                    Q.Q41K01, Q.Q41K03, Q.Q41K04, Q.Q41K07,
                    Q.Q41K05 AS BASE_SEQ,
                    TO_NUMBER(Q.Q41K06) AS BASE_LVL
                FROM S010MP A
                JOIN S011MP B
                    ON A.S01M01 = B.S11M01
                    AND A.S01M04 = B.S11M02
                JOIN Q141KP Q
                    ON Q.Q41K01 = A.S01M01
                    AND Q.Q41K03 = A.S01M06
                    AND Q.Q41K08 = B.S11M06
                WHERE B.S11M01 like :1
                AND B.S11M02 = :2
                AND B.S11M07 = '0'
            ),
            RNG AS (
                SELECT BASE.S11M06, BASE.Q41K01, BASE.Q41K03, BASE.Q41K04, BASE.Q41K07,
                    BASE.BASE_SEQ, BASE.BASE_LVL,
                    NVL((SELECT MIN(X.Q41K05)
                            FROM Q141KP X
                            WHERE X.Q41K01 = BASE.Q41K01
                            AND X.Q41K03 = BASE.Q41K03
                            AND X.Q41K04 = BASE.Q41K04
                            AND X.Q41K07 = BASE.Q41K07
                            AND X.Q41K05 > BASE.BASE_SEQ
                            AND TO_NUMBER(X.Q41K06) <= BASE.BASE_LVL), '999') AS END_SEQ
                FROM BASE
            )
            SELECT R.S11M06,
                R.BASE_LVL,
                R.BASE_SEQ,
                CASE WHEN Q.Q41K05 = R.BASE_SEQ THEN 'L' ELSE 'L+1' END AS ROW_TYPE,
                Q.*
            FROM RNG R
            JOIN Q141KP Q
                ON Q.Q41K01 = R.Q41K01
                AND Q.Q41K03 = R.Q41K03
                AND Q.Q41K04 = R.Q41K04
                AND Q.Q41K07 = R.Q41K07
                AND (   Q.Q41K05 = R.BASE_SEQ
                    OR (    Q.Q41K05 > R.BASE_SEQ
                        AND Q.Q41K05 < R.END_SEQ
                        AND TO_NUMBER(Q.Q41K06) = R.BASE_LVL + 1))
            ORDER BY R.Q41K04,
                    R.Q41K07,
                    R.BASE_LVL,
                    R.BASE_SEQ,
                    CASE WHEN Q.Q41K05 = R.BASE_SEQ THEN 0 ELSE 1 END,
                    Q.Q41K05`
            , [`_${order}_`, packing]
        );
        return result;
    }
}
