import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ITEM_SHEET_MFG', schema: 'ESCCHKSHT' })
export class ITEM_SHEET_MFG {
  @PrimaryColumn()
  NID: number;

  @Column()
  NITEMID: number;

  @Column()
  VSHEET_NAME: string;

  @Column()
  NSTATUS: number;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;
}
