import { Entity, PrimaryColumn, Column } from 'typeorm';
import { M008kp } from '../';

@Entity('Q90010P2')
export class Q90010p2 {
  @Column()
  Q9SCD: string;

  @Column()
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
  Q9DESs: string;

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

  @OneToOne(() => M008kp, (m008) => m8.bmdate)
  @JoinColumn([{ name: 'Q9ORD', referencedColumnName: 'M8K03' }])
  bmorder: M008kp;
}
