import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'M008KP',
    schema: 'ESCCHKSHT',
})
export class M008KP {
    @ViewColumn()
    M8K01: string;

    @ViewColumn()
    M8K02: string;

    @ViewColumn()
    M8K03: string;

    @ViewColumn()
    M8K04: number;
}