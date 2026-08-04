import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { Connection } from 'odbc';

@Injectable()
export class M002kpService {
    private readonly library = 'RTNLIBF';
    private readonly fields = Array.from(
        { length: 65 },
        (_, index) => `M2K${String(index + 1).padStart(2, '0')}`,
    );

    constructor(private readonly conn: ConectionService) {}

    findByOrder(order: string) {
        return this.conn.runQuery(
            `SELECT *
             FROM ${this.library}.M002KP
             WHERE M2K02 = ?
             ORDER BY M2K02`,
            [order],
        );
    }

    checkOrder(originalOrder: string) {
        return this.conn.runQuery(
            `SELECT DISTINCT TRIM(M2K02) AS ORDERNO,
                             TRIM(M2K04) AS CLAIMSLIPNO
             FROM ${this.library}.M002KP
             WHERE M2K02 = ?
             ORDER BY CLAIMSLIPNO`,
            [originalOrder],
        );
    }

    async copyToLibraries(
        connection: Connection,
        originalOrder: string,
        newOrder: string,
        schedule: string,
        claimSlipNo: string,
        libraries: string[],
    ) {
        claimSlipNo = this.claimSlipNo(claimSlipNo);
        const source = await this.findSourceRows(
            (sql, parameters) => connection.query(sql, parameters) as any,
            originalOrder,
        );
        const schedules = await this.previewScheduleRows(
            (sql, parameters) => connection.query(sql, parameters) as any,
            originalOrder,
            newOrder,
        );
        for (const library of libraries) {
            const existing = (await connection.query(
                `SELECT COUNT(*) AS CNT
                 FROM ${library}.M002KP
                 WHERE M2K02 = ?`,
                [newOrder],
            )) as any[];
            if (Number(existing[0]?.CNT || 0)) {
                throw new Error(
                    `${newOrder} already exists in ${library}.M002KP`,
                );
            }
            for (const [table, field, rows] of [
                ['M008KP', 'M8K03', schedules.m008],
                ['M012KP', 'M12K3', schedules.m012],
            ] as const) {
                if (!rows.length) continue;
                const found = (await connection.query(
                    `SELECT COUNT(*) AS CNT
                     FROM ${library}.${table}
                     WHERE ${field} = ?`,
                    [newOrder],
                )) as any[];
                if (Number(found[0]?.CNT || 0)) {
                    throw new Error(
                        `${newOrder} already exists in ${library}.${table}`,
                    );
                }
            }
        }

        for (const library of libraries) {
            const sql = `INSERT INTO ${library}.M002KP
                (${this.fields.join(', ')}) VALUES (${this.fields.map(() => '?').join(', ')})`;
            for (const row of source) {
                await connection.query(
                    sql,
                    this.fields.map((field) =>
                        field === 'M2K02'
                            ? newOrder
                            : field === 'M2K04'
                              ? claimSlipNo
                              : field === 'M2K12' || field === 'M2K13'
                                ? schedule
                                : row[field],
                    ),
                );
            }
            if (schedules.m008.length) {
                await connection.query(
                    `INSERT INTO ${library}.M008KP
                        (M8K01, M8K02, M8K03, M8K04)
                     VALUES (?, ?, ?, ?)`,
                    Object.values(schedules.m008[0]),
                );
            }
            if (schedules.m012.length) {
                await connection.query(
                    `INSERT INTO ${library}.M012KP
                        (M12K1, M12K2, M12K3, M12K4)
                     VALUES (?, ?, ?, ?)`,
                    Object.values(schedules.m012[0]),
                );
            }
        }
        return {
            m002: source.length,
            m008: schedules.m008.length,
            m012: schedules.m012.length,
        };
    }

    async previewInsert(
        originalOrder: string,
        newOrder: string,
        schedule: string,
        claimSlipNo: string,
    ) {
        claimSlipNo = this.claimSlipNo(claimSlipNo);
        const source = await this.findSourceRows(
            (sql, parameters) => this.conn.runQuery(sql, parameters),
            originalOrder,
        );
        const schedules = await this.previewScheduleRows(
            (sql, parameters) => this.conn.runQuery(sql, parameters),
            originalOrder,
            newOrder,
        );
        const m002 = source.map((sourceRow) =>
            Object.fromEntries(
                this.fields.map((field) => [
                    field,
                    field === 'M2K02'
                        ? newOrder
                        : field === 'M2K04'
                          ? claimSlipNo
                          : field === 'M2K12' || field === 'M2K13'
                            ? schedule
                            : (sourceRow[field] ?? ''),
                ]),
            ),
        );
        return { m002, ...schedules };
    }

    private async findSourceRows(
        query: (sql: string, parameters: (string | number)[]) => Promise<any[]>,
        originalOrder: string,
    ) {
        const source = await query(
            `SELECT ${this.fields.join(', ')}
             FROM ${this.library}.M002KP
             WHERE M2K02 = ?`,
            [originalOrder],
        );
        if (!source.length)
            throw new Error(`M002 not found for ${originalOrder}`);
        return source;
    }

    private async previewScheduleRows(
        query: (sql: string, parameters: (string | number)[]) => Promise<any[]>,
        originalOrder: string,
        newOrder: string,
    ) {
        const m008Source = await query(
            `SELECT M8K01, M8K02
             FROM ${this.library}.M008KP
             WHERE M8K03 = ?`,
            [originalOrder],
        );
        const m012Source = await query(
            `SELECT M12K1, M12K2
             FROM ${this.library}.M012KP
             WHERE M12K3 = ?`,
            [originalOrder],
        );
        if (m008Source.length > 1 || m012Source.length > 1) {
            throw new Error(
                `Multiple M008/M012 schedules found for ${originalOrder}`,
            );
        }
        if (m012Source.length && !m008Source.length) {
            throw new Error(
                `M012 found but M008 schedule/priority not found for ${originalOrder}`,
            );
        }
        const schedule = m008Source[0];
        return {
            m008: schedule
                ? [
                      {
                          M8K01: schedule.M8K01,
                          M8K02: schedule.M8K02,
                          M8K03: newOrder,
                          M8K04: 0,
                      },
                  ]
                : [],
            m012: m012Source.length
                ? [
                      {
                          M12K1: schedule.M8K01,
                          M12K2: schedule.M8K02,
                          M12K3: newOrder,
                          M12K4: 0,
                      },
                  ]
                : [],
        };
    }

    private claimSlipNo(value: string) {
        const claimSlipNo = String(value || '')
            .trim()
            .toUpperCase();
        if (!claimSlipNo || claimSlipNo.length > 25) {
            throw new Error(
                'Claim Slip No. is required and must not exceed 25 characters',
            );
        }
        return claimSlipNo;
    }
}
