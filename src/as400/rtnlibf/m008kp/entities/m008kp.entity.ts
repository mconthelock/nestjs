import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Q90010p2 } from '../../q90010p2/entities/q90010p2.entity';

@Entity('M008KP')
export class M008kp {
  @PrimaryColumn()
  M8K01: string;

  @PrimaryColumn()
  M8K02: string;

  @PrimaryColumn()
  M8K03: string;

  @Column()
  M8K04: string;

  @OneToOne(() => Q90010p2, (q9) => q9.bmorder)
  @JoinColumn([{ name: 'M08K03', referencedColumnName: 'Q9ORD' }])
  bmdate: Q90010p2;
}
