// EMPCOD	VARCHAR2(5)
// DEHYAR	NUMBER(4)
// SUMDILIGENT	NUMBER
// DEHT00	NUMBER(7,2)
// DEHT01	NUMBER(7,2)
// DEHT02	NUMBER(7,2)
// DEHT03	NUMBER(7,2)
// DEHT04	NUMBER(7,2)
// DEHT05	NUMBER(7,2)
// DEHT06	NUMBER(7,2)
// DEHT07	NUMBER(7,2)
// DEHT08	NUMBER(7,2)
// DEHT09	NUMBER(7,2)
// DEHT10	NUMBER(7,2)
// DEHT11	NUMBER(7,2)
// DEHT12	NUMBER(7,2)
// DEHLST	NUMBER(8)
// LVCOUNT	NUMBER
import { ViewColumn, ViewEntity } from 'typeorm';
@ViewEntity({ name: 'DILIGENT', schema: 'GPREPORT' })
export class Diligent {
    @ViewColumn()
    EMPCOD: string;

    @ViewColumn()
    DEHYAR: number;

    @ViewColumn()
    SUMDILIGENT: number;

    @ViewColumn()
    DEHT00: number;

    @ViewColumn()
    DEHT01: number;

    @ViewColumn()
    DEHT02: number;

    @ViewColumn()
    DEHT03: number;

    @ViewColumn()
    DEHT04: number;

    @ViewColumn()
    DEHT05: number;

    @ViewColumn()
    DEHT06: number;

    @ViewColumn()
    DEHT07: number;

    @ViewColumn()
    DEHT08: number;

    @ViewColumn()
    DEHT09: number;

    @ViewColumn()
    DEHT10: number;

    @ViewColumn()
    DEHT11: number;

    @ViewColumn()
    DEHT12: number;

    @ViewColumn()
    DEHLST: number;

    @ViewColumn()
    LVCOUNT: number;
}
