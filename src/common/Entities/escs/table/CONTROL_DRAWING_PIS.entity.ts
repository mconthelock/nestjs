import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'CONTROL_DRAWING_PIS', schema: 'ESCCHKSHT' })
export class CONTROL_DRAWING_PIS {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  NITEMID: number;

  @Column()
  VDRAWING: string;

  @Column()
  VREMARK: string;

  @Column()
  NSTATUS: number;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;
}
