import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { Connection } from 'odbc';

@Injectable()
export class J736kpService {
    private readonly library = 'RTNLIBF';
    private readonly sourceTable = 'J736KP';
    constructor(private readonly conn: ConectionService) {}

    findByInvPuritm(inv: string, puritm: string) {
        const cleanInv = inv.replace(/\s+/g, '');
        const cleanPuritm = puritm.replace(/\s+/g, '');
        return this.conn.runQuery(
            `SELECT *
             FROM ${this.library}.${this.sourceTable}
             WHERE REPLACE(J36K01,' ','') = ? AND REPLACE(J36K03,' ','') = ?`,
            [cleanInv, cleanPuritm],
        );
    }

    updateByFormno(formno: string) {
        return this.conn.runQuery(
            `update ${this.library}.${this.sourceTable} set J36K05 = 'Y' where J36K04 = ?`,
            [formno],
        );
    }

    findAll() {
        return `This action returns all j736kp`;
    }

    findOne(id: number) {
        return `This action returns a #${id} j736kp`;
    }

    remove(id: number) {
        return `This action removes a #${id} j736kp`;
    }
}
