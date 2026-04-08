import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from 'typeorm';
import { ITEM_STATION } from '../table/ITEM_STATION.entity';

@ViewEntity({
    name: 'USERS_AUTHORIZE_VIEW',
    schema: 'ESCCHKSHT',
})
export class USERS_AUTHORIZE_VIEW {
    @ViewColumn()
    USR_ID: number;

    @ViewColumn()
    USR_NO: string;
    
    @ViewColumn()
    USR_NAME: string;

    @ViewColumn()
    IT_NO: string;

    @ViewColumn()
    STATION_NO: number;

    @ViewColumn()
    SPOSITION: string;

    @ViewColumn()
    USR_STATUS: number;

    @ViewColumn()
    SCORE: number;

    @ViewColumn()
    GRADE: string;

    @ViewColumn()
    TOTAL: number;

    @ViewColumn()
    PERCENT: number;

    @ViewColumn()
    REV: number;

    @ViewColumn()
    TEST_BY: string;

    @ViewColumn()
    TEST_DATE: Date;

    @ViewColumn()
    TR: number;

    @ViewColumn()
    SSEC: string;

    @ViewColumn()
    SSECCODE: string;

    @ViewColumn()
    SDEPT: string;

    @ViewColumn()
    SDEPCODE: string;

    @ViewColumn()
    SDIV: string;

    @ViewColumn()
    SDIVCODE: string;

    @OneToOne(() => ITEM_STATION, (s) => s.AUTHORIZE_VIEW)
    @JoinColumn({ name: 'IT_NO', referencedColumnName: 'ITS_ITEM' })
    @JoinColumn({ name: 'STATION_NO', referencedColumnName: 'ITS_NO' })
    STATION: ITEM_STATION;
}
