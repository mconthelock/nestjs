import { Workplan } from 'src/docinv/workplan/entities/workplan.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('RLSNTC')
export class Release {
  @PrimaryColumn()
  NFRMNO: string;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: string;

  @Column()
  PLANID: number;

  @Column()
  SDEVDT: string;

  @Column()
  EDEVDT: string;

  @Column()
  TTHRS: string;

  @Column()
  PLANRLS: string;

  @Column()
  ACTRLS: string;

  @Column()
  NOTICE: string;

  @Column()
  ORIGDIR: string;

  @Column()
  DSTNDIR: string;

  @Column()
  FINALST: string;

  @Column()
  FLAGCF: string;

  @Column()
  RSDIFF: string;

  @Column()
  EVIDPATH: string;

  @ManyToOne(() => Workplan, (plan) => plan.release)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
  workplan: Workplan;
}
