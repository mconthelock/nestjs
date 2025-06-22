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

  @ManyToOne(() => F001KP, (f01data) => f01data.F01R01)
  @JoinColumn({ name: 'MENU_ID' })
  F001KP: F001KP;
}
