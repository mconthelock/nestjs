import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VALL_SPACCARRNGLST')
export class Spaccarrnglst {
  @PrimaryColumn()
  ORDERNO: string;

  @PrimaryColumn()
  ITEMNO: string;

  @PrimaryColumn()
  SERIALNO: string;

  @Column()
  BMCLS: string;

  @Column()
  ITEMC: string;

  @Column()
  APNAMERMRK: string;

  @Column()
  PARTNO: string;

  @Column()
  SCNDPRTCLS: string;
}
