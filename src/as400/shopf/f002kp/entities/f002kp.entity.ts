import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { F001KP } from '../../f001kp/entities/f001kp.entity';

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

  @ManyToOne(() => F001KP, (f1) => f1.process)
  @JoinColumn([{ name: 'F02R01', referencedColumnName: 'F01R01' }])
  tags: F001KP;
}
