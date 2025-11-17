import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AUDIT_REPORT_HISTORY', schema: 'ESCCHKSHT' })
export class AuditReportHistory {
  @PrimaryColumn()
  ARH_SECID: number;

  @PrimaryColumn()
  ARH_REV: number;

  @PrimaryColumn()
  ARH_NO: number;

  @PrimaryColumn()
  ARH_SEQ: number;

  @Column()
  ARH_DETAIL: string;

  @Column()
  ARH_TYPE: string;

  @Column()
  ARH_STATUS: number;

  @Column()
  ARH_FACTOR?: number;

  @Column()
  ARH_MAXSCORE?: number;
}
