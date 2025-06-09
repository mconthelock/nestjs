import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('AMECMFG.F002KP')
export class F002KP {
  @PrimaryColumn()
  F02R01: string;

  @PrimaryColumn()
  F02R02: number;

  @Column()
  F02R03: string;

  @Column()
  F02R04: number;

  @Column()
  F02R05: number;

  @Column()
  F02R06: string;

  @Column()
  F02R07: number;

  @Column()
  F02R08: string;
}
