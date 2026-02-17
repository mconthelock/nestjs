import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'ITEM_MFG_LIST', schema: 'ESCCHKSHT' })
@Unique(['NITEMID', 'VDRAWING'])
export class ITEM_MFG_LIST {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  NITEMID: number;

  @Column()
  VDRAWING: string;
    
  @Column()
  NSHEETID: number;

  @Column()
  VNUMBER_FILE: string;

  @Column()
  VREMARK: string;

  @Column()
  NSTATUS: number;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;
}
