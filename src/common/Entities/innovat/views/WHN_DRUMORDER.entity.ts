import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'WHN_DRUMORDER',
    schema: 'INNOVAT',
})
export class WHN_DRUMORDER {
    @ViewColumn()
    CTRLNO: string;

    @ViewColumn()
    REGDATE: Date;

    @ViewColumn()
    ITEMCODE: string;

    @ViewColumn()
    PRODNO: string;

    @ViewColumn()
    DRUMID: number;

    @ViewColumn()
    PROD: string;

    @ViewColumn()
    CABLECODE: string;

    @ViewColumn()
    LENMASTER: number;

    @ViewColumn()
    LENREMAIN: number;

    @ViewColumn()
    DRUMTYPE: number;

    @ViewColumn()
    RN: number;
}