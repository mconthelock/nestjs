import { Injectable } from '@nestjs/common';
import { parseCreateString } from 'src/common/helpers/query.helper';
import { ConectionService } from 'src/as400/conection/conection.service';
import { FiltersDto } from 'src/common/dto/filter.dto';

export interface EmptaxInsertRow {
    XAMCOD: string;
    XAMRST: string;
    XAMMRD: number;
    XAMSNA: string;
    XABNED: number;
    XAANED: number;
    XABIED: number;
    XAAIED: number;
    XAXEMF: string;
    XAXEMM: string;
    XAXSFT: string;
    XAXSPM: string;
    XAXINS: number;
    XAXSIN: number;
    XAXRMF: number;
    XAXLTF: number;
    XAXINL: number;
    XAXEDU: number;
    XAXDON: number;
    XAXINH: number;
    XAXINP: number;
    XAXANU: number;
    XAXDIS: number;
    XAXPRG: number;
    XAXOT1: number;
    XAXOT2: number;
    XSTS: string;
}

@Injectable()
export class EmptaxService {
    private readonly library = 'DATALIBI';
    private readonly table = 'EMPTAX';

    constructor(private conn: ConectionService) {}

    async create(data: FiltersDto, table: string) {
        const query = await parseCreateString(data, table);
        const result = await this.conn.runQuery(query);
        return result;
    }

    async insert(row: EmptaxInsertRow) {
        const columns = Object.keys(row) as (keyof EmptaxInsertRow)[];
        const placeholders: string[] = [];
        const values: (string | number)[] = [];

        for (const col of columns) {
            if (col === 'XAMSNA') {
                // Convert Thai/Unicode text to DB2 UCS-2 hex literal (CCSID 13488) and cast to CCSID 838
                // to avoid node-odbc UTF-8 byte length overflow (CWB0111) and Thai mojibake.
                placeholders.push(this.toDb2ThaiLiteral(String(row[col] ?? ''), 40));
            } else {
                placeholders.push('?');
                values.push(row[col]);
            }
        }

        const sql = `INSERT INTO ${this.library}.${this.table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
        return this.conn.runQuery(sql, values);
    }

    private toDb2ThaiLiteral(value: string, maxLength: number): string {
        const trimmed = (value ?? '').trim().slice(0, maxLength);
        if (!trimmed) {
            return "''";
        }
        const hex = Array.from(trimmed)
            .map((ch) => ch.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase())
            .join('');
        return `CAST(UX'${hex}' AS VARCHAR(${maxLength}) CCSID 838)`;
    }
}
