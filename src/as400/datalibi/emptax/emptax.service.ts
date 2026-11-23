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
        const placeholders = columns.map(() => '?').join(', ');
        const values = columns.map((col) => row[col]);
        const sql = `INSERT INTO ${this.library}.${this.table} (${columns.join(', ')}) VALUES (${placeholders})`;
        return this.conn.runQuery(sql, values);
    }
}
