import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { F001KP } from '../../f001kp/entities/f001kp.entity';

@Entity('AMECMFG.F003KP')
export class F003KP {
  @PrimaryColumn()
  F03R01: string;

  @PrimaryColumn()
  F03R02: string;

  @Column()
  F03R03: number;

  @Column()
  F03R04: string;

  @ManyToOne(() => F001KP, (f1) => f1.detail)
  @JoinColumn([{ name: 'F03R01', referencedColumnName: 'F01R01' }])
  tags: F001KP;
}
