import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  name: "WORK_ANNUAL_DEV_PLAN",
  schema: "DOCINV",
})
export class WorkAnnualDevPlan {
    @ViewColumn()
    PLANYEAR: number;

    @ViewColumn()
    REQ_DIV: string;

    @ViewColumn()
    SDIV: string;

    @ViewColumn()
    USER_REQ: number;

    @ViewColumn()
    MH: number;

    @ViewColumn()
    COST: number;
}
