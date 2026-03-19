import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'F002KP', schema: 'AMECMFG' })
export class F002KP {
  @PrimaryColumn()
  F02R01: string;

  @Column()
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
