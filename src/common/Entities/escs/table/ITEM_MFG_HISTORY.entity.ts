import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'ITEM_MFG_HISTORY', schema: 'ESCCHKSHT' })
@Unique(['NITEMID', 'NMARKNUM'])
export class ITEM_MFG_HISTORY {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  NITEMID: number;

  @Column()
  NMARKNUM: number;

  @Column()
  VMARK: string;

  @Column()
  VMARK_REMARK: string;

  @Column()
  VINCHAREGE: string;

  @Column()
  VINCHAREGE_REMARK: string;

  @Column()
  NSTATUS: number;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;
}
