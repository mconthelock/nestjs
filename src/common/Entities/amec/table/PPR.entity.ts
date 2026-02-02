import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PPR', schema: 'AMEC' })
export class PPR {
  @PrimaryColumn()
  SPRNO: string;

  @Column()
  SEXPTYPE: string;

  @Column()
  DPRDATE: Date;

  @Column()
  SREQUESTER: string;

  @Column()
  SKEY: string;

  @Column()
  CPRTYPE: string;

  @Column()
  NSTEP: number;

  @Column()
  CAPPROVE: string;

  @Column()
  CPO: string;

  @Column()
  SCASHREQ: string;

  @Column()
  SDELIVERY: string;

  @Column()
  DFINISHDATE: Date;

  @Column()
  DDELIVERY: Date;

  @Column()
  FYEAR: string;
}
