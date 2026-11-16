import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'VPS_USER_REPRINT',
    schema: 'WORKLOAD',
})
export class VPS_USER_REPRINT {
    @ViewColumn()
    SEMPNO: string;

    @ViewColumn()
    STATUS_REPRINT: number;
}