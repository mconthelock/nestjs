import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'WHN_DRUMSTOCK',
    schema: 'INNOVAT',
})
export class WHN_DRUMSTOCK {
    @ViewColumn()
    ITEMCODE: string;

    @ViewColumn()
    PRODNO: string;

    @ViewColumn()
    DRUMID: number;

    @ViewColumn()
    LENMASTER: number;

    @ViewColumn()
    LENREMAIN: number;

    @ViewColumn()
    CABLECODE: string;

    @ViewColumn()
    RECIVEDATE: Date;

    @ViewColumn()
    USERUPDATE: string;

    @ViewColumn()
    DATEUPDATE: Date;

    @ViewColumn()
    DRUMTYPE: number;

    @ViewColumn()
    GRPID: number;

    @ViewColumn()
    PROD: string;

    @ViewColumn()
    BARCODE: string;

    @ViewColumn()
    RECIVE: string;
}