import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ESCS_USERS_AUTHORIZE')
export class ESCSUserAuthorize {
  @PrimaryColumn()
  UA_ITEM: string;

  @PrimaryColumn()
  UA_STATION: number;

  @PrimaryColumn()
  UA_USR_NO: string;

  @Column()
  UA_SCORE: number;

  @Column()
  UA_GRADE: string;

  @Column()
  UA_TOTAL: number;

  @Column()
  UA_PERCENT: number;

  @Column()
  UA_REV: number;

  @Column()
  UA_CREATEDATE: Date;
}
