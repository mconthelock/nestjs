import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('AMECCALENDAR')
export class Ameccalendar {
  @PrimaryColumn()
  WORKID: number;

  @Column()
  FYEAR: number;

  @Column()
  WORKYEAR: number;

  @Column()
  WORKMONTH: number;

  @Column()
  WORKDAY: number;

  @Column()
  WORKNUM: number;

  @Column()
  DAYOFF: number;

  @Column()
  WORKHOUR: number;

  @Column()
  WORKHOUROT: number;

  @Column()
  SCHDNUMBER: string;

  @Column()
  SCHDMFG: string;

  @Column()
  PRIORITY: string;

  @Column()
  FEEDER1: number;

  @Column()
  FEEDER2: number;

  @Column()
  SUBASSY_FINISH: number;

  @Column()
  ASSY_FINISH: number;

  @Column()
  INSPECTION_FINISH: number;

  @Column()
  PACKING: number;
}
