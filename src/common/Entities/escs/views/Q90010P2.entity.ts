import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'Q90010P2',
    schema: 'ESCCHKSHT',
})
export class Q90010P2 {
    @ViewColumn()
    Q9ORD: string;

    @ViewColumn()
    Q9TYP: string;
}