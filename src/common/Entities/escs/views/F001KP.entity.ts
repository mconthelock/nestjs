import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'F001KP',
    schema: 'ESCCHKSHT',
})
export class F001KP {
    @ViewColumn()
    F01R01: string;

    @ViewColumn()
    F01R02: string;

    @ViewColumn()
    F01R03: string;

    @ViewColumn()
    F01R04: string;

    @ViewColumn()
    F01R05: string;

    @ViewColumn()
    F01R06: string;

    @ViewColumn()
    F01R07: string;
}