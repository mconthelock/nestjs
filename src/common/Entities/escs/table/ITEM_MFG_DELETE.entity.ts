import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'ITEM_MFG_DELETE', schema: 'ESCCHKSHT' })
export class ITEM_MFG_DELETE {
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
