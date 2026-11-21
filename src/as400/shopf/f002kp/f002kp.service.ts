import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

@Injectable()
export class F002kpService {
    private readonly isProduction = process.env.STATE === 'production';

    constructor(
        private readonly as400: ConectionService,
    ) {}

    updateTag(ctrlno: string, process: string, period: string, finish: number, remark: string) {
        if (!this.isProduction) return;

        return this.as400.runQuery(`
            UPDATE SHOPF.F002KP
            SET F02R06 = '${period}',
                F02R07 = ${finish},
                F02R08 = '${remark}'
            WHERE F02R01 = '${ctrlno}'
                AND F02R03 = '${process}'
                AND F02R07 = 0
        `);
    }

    cancelTag(ctrlno: string, process: string) {
        if (!this.isProduction) return;

        return this.as400.runQuery(`
            UPDATE SHOPF.F002KP
            SET F02R06 = '',
                F02R07 = 0,
                F02R08 = ' '
            WHERE F02R01 = '${ctrlno}'
                AND F02R03 = '${process}'
        `);
    }
}