import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'WHN_PRODUCTION',
    schema: 'INNOVAT',
})
export class WHN_PRODUCTION {
    @ViewColumn()
    PRODNO: string;

    @ViewColumn()
    PROD: string;
}