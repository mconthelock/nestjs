import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { PSCLM_DETAIL } from 'src/common/Entities/webform/table/PSCLM_DETAIL.entity';
import { Connection } from 'odbc';

export function scheduleToDate(schedule: string) {
    const value = String(schedule || '')
        .trim()
        .toUpperCase();
    const day = { X: '05', A: '10', Y: '15', B: '20', Z: '25', C: '30' }[
        value.slice(-1)
    ];
    if (!/^\d{4}[XAYBZC]$/.test(value) || !day) {
        throw new Error(`Invalid Schedule: ${value || 'blank'}`);
    }
    return `${value.slice(0, 4)}${day}`;
}

@Injectable()
export class M001kpService {
    private readonly library = 'RTNLIBF';

    constructor(private readonly conn: ConectionService) {}

    findByOrder(order: string) {
        return this.conn.runQuery(
            `SELECT *
             FROM ${this.library}.M001KP
             WHERE M1K02 = ?
             ORDER BY M1K02, M1K03, M1K04, M1K18`,
            [order],
        );
    }

    findOrdersByDrawing(
        drawing: string,
        qty: string | number,
        variable?: string,
    ) {
        const [number = '', gno = '', ...levels] = String(drawing || '')
            .trim()
            .toUpperCase()
            .split(/\s+/);
        const quantity = Number(qty);
        const variables = String(variable || '')
            .trim()
            .toUpperCase()
            .split(',')
            .filter(Boolean);
        if (
            !/^[A-Z0-9-]{5,9}$/.test(number) ||
            (gno && !/^(?:G|-)[0-9]{2,3}$/.test(gno)) ||
            levels.length > 9 ||
            levels.some((level) => !/^L[0-9]{2}$/.test(level)) ||
            !Number.isInteger(quantity) ||
            quantity <= 0 ||
            variables.length > 15 ||
            variables.some(
                (entry) => !/^[^=,\s]{1,3}=[^=,\s]{1,9}$/.test(entry),
            )
        ) {
            throw new Error('Invalid Drawing, QTY or Variable');
        }

        const fields = ['M1K19', ...(gno ? ['M1K21'] : [])];
        const values: (string | number)[] = [number, ...(gno ? [gno] : [])];
        levels.forEach((level, index) => {
            fields.push(`M1K${22 + index}`);
            values.push(index ? level.slice(1) : level);
        });
        fields.push('M1K34');
        values.push(String(quantity).padStart(3, '0'));
        variables.forEach((entry, index) => {
            const [code, value] = entry.split('=');
            fields.push(`M1K${43 + index * 2}`, `M1K${44 + index * 2}`);
            values.push(code, value);
        });
        return this.conn.runQuery(
            `SELECT DISTINCT TRIM(M.M1K02) AS ORDERNO,
                             TRIM(M.M1K03) AS ITEMNO,
                             COALESCE(NULLIF(TRIM(Q.BMZTIT), ''), 'NOTFO') AS PARTNAME
             FROM ${this.library}.M001KP M
             LEFT JOIN ${this.library}.Q001MP Q ON Q.BMZUBA = M.M1K19
             WHERE ${fields.map((field) => `M.${field} = ?`).join(' AND ')}
               AND (M.M1K02 LIKE 'E%' OR M.M1K02 LIKE 'S%')
             ORDER BY ORDERNO, ITEMNO, PARTNAME`,
            values,
        );
    }

    async addToLibraries(
        connection: Connection,
        newOrder: string,
        details: PSCLM_DETAIL[],
        libraries: string[],
    ) {
        for (const library of libraries) {
            const table = this.tableForLibrary(library);
            const existing = (await connection.query(
                `SELECT COUNT(*) AS CNT
                 FROM ${library}.${table}
                 WHERE M1K02 = ?`,
                [newOrder],
            )) as any[];
            if (Number(existing[0]?.CNT || 0)) {
                throw new Error(
                    `${newOrder} already exists in ${library}.${table}`,
                );
            }
        }

        const rows = this.previewInsert(newOrder, details);
        const fields = Array.from(
            { length: 81 },
            (_, index) => `M1K${String(index + 1).padStart(2, '0')}`,
        );
        for (const library of libraries) {
            const table = this.tableForLibrary(library);
            const sql = `INSERT INTO ${library}.${table}
                (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
            for (const row of rows) {
                await connection.query(
                    sql,
                    fields.map((field) => row[field]),
                );
            }
        }
        return rows.length;
    }

    previewInsert(newOrder: string, details: PSCLM_DETAIL[]) {
        return this.buildRows(newOrder, details);
    }

    private buildRows(newOrder: string, details: PSCLM_DETAIL[]) {
        newOrder = this.fit(newOrder, 9, 'New Order');
        const control = newOrder.startsWith('E')
            ? 'L'
            : newOrder.startsWith('S')
              ? 'W'
              : '';
        if (!control) throw new Error('New Order must start with E or S');

        const sequence = new Map<string, number>();
        const rows: Record<string, string | number>[] = [];
        for (const detail of details) {
            const item = this.fit(detail.ITEM, 4, 'Item');
            const schedule = this.fit(detail.SCHDNUM, 5, 'Schedule');
            const scheduleDate = scheduleToDate(schedule);
            const drawing = this.drawingFields(detail.DRAWING);
            const variables = this.variableFields(detail.VARIABLE);
            let quantity = Number(detail.QTY);
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error(`Invalid QTY for item ${item}`);
            }

            while (quantity > 0) {
                const key = `${newOrder}:${item}`;
                const nextSequence = (sequence.get(key) || 0) + 1;
                sequence.set(key, nextSequence);
                const row = Object.fromEntries(
                    Array.from({ length: 81 }, (_, index) => [
                        `M1K${String(index + 1).padStart(2, '0')}`,
                        '',
                    ]),
                ) as Record<string, string | number>;
                Object.assign(row, {
                    M1K02: newOrder,
                    M1K03: item,
                    M1K04: schedule,
                    M1K06: 'M',
                    M1K07: 'BO',
                    M1K08: 'Y',
                    M1K09: scheduleDate,
                    M1K10: scheduleDate,
                    M1K11: this.block(item),
                    M1K12: this.block(item),
                    M1K17: '0',
                    M1K18: String(nextSequence).padStart(3, '0'),
                    M1K31: 'X',
                    M1K32: '400',
                    M1K34: String(Math.min(quantity, 999)).padStart(3, '0'),
                    M1K35: control,
                    M1K37: 'E',
                    M1K38: '1',
                    M1K39: 'A',
                    M1K41: this.fit(
                        detail.PARTNAME || 'NOTFO',
                        16,
                        'Part name',
                    ),
                    ...drawing,
                    ...variables,
                });
                rows.push(row);
                quantity -= 999;
            }
        }
        return rows;
    }

    private tableForLibrary(library: string) {
        if (library === 'RTNLIBF') return 'M001KPBM';
        if (library === 'DBGDEV14') return 'M001KP';
        throw new Error(`Unsupported M001 library: ${library}`);
    }

    private drawingFields(value: string) {
        const [drawing = '', gno = '', ...levels] = String(value || '')
            .trim()
            .toUpperCase()
            .split(/\s+/);
        const fields: Record<string, string> = {
            M1K19: this.fit(drawing, 9, 'Drawing'),
            M1K20: '',
            M1K21: this.fit(gno, 4, 'G No.', false),
            M1K22: this.fit(levels[0] || '', 3, 'L No. 1', false),
        };
        for (let index = 1; index < 9; index++) {
            fields[`M1K${String(index + 22).padStart(2, '0')}`] = this.fit(
                String(levels[index] || '').replace(/^L/, ''),
                2,
                `L No. ${index + 1}`,
                false,
            );
        }
        return fields;
    }

    private variableFields(value: string) {
        const fields: Record<string, string> = {};
        const variables = String(value || '')
            .split(',')
            .map((entry) => entry.trim().toUpperCase())
            .filter(Boolean);
        if (variables.length > 15) throw new Error('Variable limit is 15');
        if (
            variables.some(
                (entry) => !/^[^=,\s]{1,3}=[^=,\s]{1,9}$/.test(entry),
            )
        ) {
            throw new Error('Invalid Variable format');
        }
        for (let index = 0; index < 15; index++) {
            const [code = '', variable = ''] = String(
                variables[index] || '',
            ).split('=');
            fields[`M1K${43 + index * 2}`] = this.fit(
                code,
                3,
                `Variable code ${index + 1}`,
                false,
            );
            fields[`M1K${44 + index * 2}`] = this.fit(
                variable,
                9,
                `Variable ${index + 1}`,
                false,
            );
        }
        return fields;
    }

    private block(item: string) {
        if (item === '295' || /^[67]/.test(item)) return 'D';
        if (/^2/.test(item)) return 'E';
        if (/^[13]/.test(item)) return 'A';
        return '';
    }

    private fit(
        value: unknown,
        length: number,
        field: string,
        required = true,
    ) {
        const text = String(value ?? '')
            .trim()
            .toUpperCase();
        if ((required && !text) || text.length > length) {
            throw new Error(`Invalid ${field}: ${text || 'blank'}`);
        }
        return text;
    }
}
