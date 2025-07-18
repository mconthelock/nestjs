import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { M008KP } from '../../../rtnlibf/m008kp/entities/m008kp.entity';
import { F002KP } from '../../f002kp/entities/f002kp.entity';
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

  @ManyToOne(() => M008KP, (m8) => m8.tags)
  @JoinColumn([{ name: 'F01R07', referencedColumnName: 'M8K03' }])
  schd: M008KP;

  @OneToMany(() => F002KP, (f2) => f2.tags)
  @JoinColumn([{ name: 'F01R01', referencedColumnName: 'F02R01' }])
  process: F002KP[];

  @OneToMany(() => F003KP, (f3) => f3.tags)
  @JoinColumn([{ name: 'F01R01', referencedColumnName: 'F03R01' }])
  detail: F003KP[];
}
