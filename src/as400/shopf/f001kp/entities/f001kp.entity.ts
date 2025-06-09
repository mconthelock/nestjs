import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { F003KP } from '../../f003kp/entities/f003kp.entity';

@Entity('AMECMFG.F001KP')
export class F001KP {
  @PrimaryColumn()
  F01R01: string;

  @Column()
  F01R02: string;

  @Column()
  F01R03: string;

  @Column()
  F01R04: string;

  @Column()
  F01R05: string;

  @Column()
  F01R06: string;

  @Column()
  F01R07: string;

  @Column()
  F01R08: string;

  @Column()
  F01R09: string;

  @Column()
  F01R10: number;

  @Column()
  F01R11: number;

  @Column()
  F01R12: number;

  @Column()
  F01R13: number;

  @Column()
  F01R14: number;

  @Column()
  F01R15: number;

  @Column()
  F01R16: string;

  @Column()
  F01R17: number;

  @Column()
  F01R18: string;

  @Column()
  F01R19: string;

  @Column()
  FILLER: string;

  @OneToMany(() => F003KP, (f03data) => f03data.F03R01)
  f03data: F003KP[];
}
