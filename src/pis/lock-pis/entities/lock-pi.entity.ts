import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LOCKPIS')
export class LockPis {
  @PrimaryColumn()
  ITEM_NO: string;

  @PrimaryColumn()
  ORD_NO: string;

  @Column()
  LOCKED_BY_EMPNO: string;

  @Column()
  SOCKET_ID: string;

  @Column()
  CREATED_AT: Date;
}
