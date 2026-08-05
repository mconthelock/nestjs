import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { convertJung } from 'src/common/utils/format.utils';
import { Connection } from 'odbc';

export function buildScheduleRows(
    newOrder: string,
    schedule: string,
    priority: string,
) {
    const mfgSchedule = convertJung(`20${schedule}`);
    if (!mfgSchedule) throw new Error(`Invalid Schedule: ${schedule}`);

    return {
        m008: [
            {
                M8K01: mfgSchedule,
                M8K02: priority,
                M8K03: newOrder,
                M8K04: 0,
            },
        ],
        m012: [
            {
                M12K1: mfgSchedule,
                M12K2: priority,
                M12K3: newOrder,
                M12K4: 0,
            },
        ],
    };
}

@Injectable()
export class M002kpService {
    private readonly library = 'RTNLIBF';
    private readonly sourceTable = 'M002KPBM';
    private readonly fields = Array.from(
        { length: 65 },
        (_, index) => `M2K${String(index + 1).padStart(2, '0')}`,
    );

    constructor(private readonly conn: ConectionService) {}

    findByOrder(order: string) {
        return this.conn.runQuery(
            `SELECT *
             FROM ${this.library}.${this.sourceTable}
             WHERE M2K02 = ?
             ORDER BY M2K02`,
            [order],
        );
    }

    checkOrder(originalOrder: string) {
        return this.conn.runQuery(
            `SELECT DISTINCT TRIM(M2K02) AS ORDERNO,
                             TRIM(M2K04) AS CLAIMSLIPNO
             FROM ${this.library}.${this.sourceTable}
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
        priority: string,
        claimSlipNo: string,
        libraries: string[],
    ) {
        claimSlipNo = this.claimSlipNo(claimSlipNo);
        const source = await this.findSourceRows(
            (sql, parameters) => connection.query(sql, parameters) as any,
            originalOrder,
        );
        const schedules = buildScheduleRows(newOrder, schedule, priority);
        for (const library of libraries) {
            const table = this.tableForLibrary(library);
            const existing = (await connection.query(
                `SELECT COUNT(*) AS CNT
                 FROM ${library}.${table}
                 WHERE M2K02 = ?`,
                [newOrder],
            )) as any[];
            if (Number(existing[0]?.CNT || 0)) {
                throw new Error(
                    `${newOrder} already exists in ${library}.${table}`,
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
            const table = this.tableForLibrary(library);
            const sql = `INSERT INTO ${library}.${table}
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
        priority: string,
        claimSlipNo: string,
    ) {
        claimSlipNo = this.claimSlipNo(claimSlipNo);
        const source = await this.findSourceRows(
            (sql, parameters) => this.conn.runQuery(sql, parameters),
            originalOrder,
        );
        const schedules = buildScheduleRows(newOrder, schedule, priority);
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
             FROM ${this.library}.${this.sourceTable}
             WHERE M2K02 = ?`,
            [originalOrder],
        );
        if (!source.length)
            throw new Error(`M002 not found for ${originalOrder}`);
        return source;
    }

    private tableForLibrary(library: string) {
        if (library === 'RTNLIBF') return 'M002KPBM';
        if (library === 'DBGDEV14') return 'M002KP';
        throw new Error(`Unsupported M002 library: ${library}`);
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
