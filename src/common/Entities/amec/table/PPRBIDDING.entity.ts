import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PPRBIDDING', schema: 'AMEC' })
export class PPRBIDDING {
  @PrimaryColumn()
  SPRNO: string;

  @Column()
  BIDDINGNO: string;

  @Column()
  EBUDGETNO: string;
}
