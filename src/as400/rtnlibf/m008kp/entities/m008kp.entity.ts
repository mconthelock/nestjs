import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Q90010P2 } from '../../q90010p2/entities/q90010p2.entity';
import { F001KP } from '../../../shopf/f001kp/entities/f001kp.entity';

@Entity('AMECMFG.M008KP')
export class M008KP {
  @PrimaryColumn()
  M8K01: string;

  @PrimaryColumn()
  M8K02: string;

  @PrimaryColumn()
  M8K03: string;

  @Column()
  M8K04: string;

  @OneToOne(() => Q90010P2, (q9) => q9.Q9ORD)
  @JoinColumn([{ name: 'M8K03', referencedColumnName: 'Q9ORD' }])
  bmdate: Q90010P2;

  @OneToMany(() => F001KP, (f1) => f1.schd)
  @JoinColumn([{ name: 'M8K03', referencedColumnName: 'F01R07' }])
  tags: F001KP[];
}
