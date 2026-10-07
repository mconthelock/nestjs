import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'COUNTRY_ORIGIN_NOT_SET_VIEW', schema: 'WORKLOAD' })
export class COUNTRY_ORIGIN_NOT_SET_VIEW {
    @ViewColumn()
    PURCODE: string;

    @ViewColumn()
    PLANNER: string;

    @ViewColumn()
    PLANNERNAME: string;

    @ViewColumn()
    PLANNER_CODE: string;

    @ViewColumn()
    SRECMAIL: string;
}
