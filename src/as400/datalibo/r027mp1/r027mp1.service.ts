import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
@Injectable()
export class R027Mp1Service {
    private readonly library = 'DATALIBO';
    private readonly sourceTable = 'R027MP1';
    constructor(private readonly conn: ConectionService) {}

    getnewcn(firstno: string) {
        const sql = `
        SELECT
            'F' || VARCHAR_FORMAT(CURRENT DATE, 'YY') ||
            RIGHT(
                DIGITS(
                    COALESCE(
                        INTEGER(
                            RIGHT(
                                (SELECT MAX(R27M09)
                                FROM ${this.library}.${this.sourceTable}
                                WHERE R27M09 LIKE 'F' || VARCHAR_FORMAT(CURRENT DATE, 'YY') || '%'
                                ),
                                4
                            )
                        ),
                        0
                    ) + 1
                ),
                4
            ) AS R27M09
        FROM ${this.library}.${this.sourceTable}
        WHERE R27M09 = ?
    `;
        return this.conn.runQuery(sql, [firstno.trim()]);
    }

    insertNewCn(newcn: string, firstno: string) {
        const sql = `
        INSERT INTO ${this.library}.${this.sourceTable} (
            R27M01, R27M02, R27M03, R27M04, R27M05,
            R27M06, R27M07, R27M08, R27M09, R27M10,
            R27M11, R27M12, R27M13, R27M14
        )
        SELECT
            L.R27M01,
            L.R27M02,
            L.R27M03,
            L.R27M04,
            L.R27M05,
            L.R27M06,
            L.R27M07,
            L.R27M08,
            ? AS R27M09,
            L.R27M10,
            L.R27M11,
            L.R27M12,
            VARCHAR_FORMAT(CURRENT DATE, 'YYYYMMDD') AS R27M13,
            L.R27M14
        FROM ${this.library}.${this.sourceTable} L
        WHERE L.R27M09 = ?
    `;
        return this.conn.runQuery(sql, [newcn, firstno.trim()]);
    }
}
