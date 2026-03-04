import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VALL_SPACCARRNGLST')
export class Spaccarrnglst {
  @PrimaryColumn()
  ORDERNO: string;

  @Column()
  MELCALACLS: string;

  @PrimaryColumn()
  ITEMNO: string;

  @PrimaryColumn()
  SERIALNO: string;

  @Column()
  BMCLS: string;

  @Column()
  APNAMERMRK: string;

  @Column()
  PARTNO: string;

  @Column()
  TOTALQTY: number;

  @Column()
  SCNDPRTCLS: string;

  @Column()
  SUPPLYCLS: string;

  @Column()
  REVSUBNO: string;
}
