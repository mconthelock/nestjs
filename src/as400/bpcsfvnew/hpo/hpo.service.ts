import { Injectable } from '@nestjs/common';
import { Connection } from 'odbc';
import { ConectionService } from 'src/as400/conection/conection.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class HpoService {
    private readonly library = 'BPCSFVNEW';
    private readonly sourceTable = 'HPO';
    constructor(private readonly conn: ConectionService) {}

    updateByOrderProd(order: string, prod: string, formno: string) {
        return this.conn.runQuery(
            `update ${this.library}.${this.sourceTable} set PCMT = ? where PORD = ? AND PPROD = ?`,
            [formno, order, prod],
        );
    }

    findAll() {
        return `This action returns all hpo`;
    }

    findOne(id: number) {
        return `This action returns a #${id} hpo`;
    }

    remove(id: number) {
        return `This action removes a #${id} hpo`;
    }
}
