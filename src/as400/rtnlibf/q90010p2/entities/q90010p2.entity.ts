import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { M008KP } from '../../m008kp/entities/m008kp.entity';

@Entity('AMECMFG.Q90010P2')
export class Q90010P2 {
  @PrimaryColumn()
  Q9SCD: string;

  @PrimaryColumn()
  Q9ORD: string;

  @Column()
  Q9PRJ: string;

  @Column()
  Q9AGN: string;

  @Column()
  Q9TYP: string;

  @Column()
  Q9IDS: string;

  @Column()
  Q9CAL: string;

  @Column()
  Q9DES: string;

  @Column()
  Q9PP: string;

  @Column()
  Q9TAGF: string;

  @Column()
  Q9TAGL: string;

  @Column()
  Q9QCF: string;

  @Column()
  Q9QCL: string;

  @Column()
  Q9PCKF: string;

  @Column()
  Q9PCKL: string;

  @Column()
  Q9SHPF: string;

  @Column()
  Q9SHPL: string;

  @Column()
  Q9GOD: string;

  @OneToOne(() => M008KP, (m8) => m8.M8K03)
  @JoinColumn([{ name: 'Q9ORD', referencedColumnName: 'M8K03' }])
  bmorder: M008KP;
}
