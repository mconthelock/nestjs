import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('ORGTREE')
export class OrgTree {
  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  VPARENT: string;

  @Column()
  CSTART: string;
}
