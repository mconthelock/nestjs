import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  name: 'SHORTAGE_ISSUE',
  schema: 'WORKLOAD',
})
export class SHORTAGE_ISSUE {
  @ViewColumn()
  SCHDMFG_N5: string;
  @ViewColumn()
  SCHDMFG_N4: string;
  @ViewColumn()
  SCHDMFG_N3: string;
  @ViewColumn()
  SCHDMFG_N2: string;
  @ViewColumn()
  SCHDMFG_N1: string;
  @ViewColumn()
  SCHDMFG_N0: string;
}