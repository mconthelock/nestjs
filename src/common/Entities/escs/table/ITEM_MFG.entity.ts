import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ITEM_MFG', schema: 'ESCCHKSHT' })
export class ITEM_MFG {
  @PrimaryColumn()
  NID: number;

  @Column()
  VITEM_NAME: string;

  @Column()
  NBLOCKID: number;

  @Column()
  VPATH: string;

  @Column()
  NSTATUS: number;

  @Column()
  NSEC_ID: number;

  @Column()
  NTYPE: number;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;
}
