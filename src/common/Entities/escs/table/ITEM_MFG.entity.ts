import { UserSection } from 'src/escs/user_section/entities/user_section.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITEM_STATUS } from './ITEM_STATUS.entity';
import { ITEM_MFG_TYPE } from './ITEM_MFG_TYPE.entity';
import { ITEM_MFG_LIST } from './ITEM_MFG_LIST.entity';
import { ITEM_SHEET_MFG } from './ITEM_SHEET_MFG.entity';
import { BLOCK_MASTER } from './BLOCK_MASTER.entity';

@Entity({ name: 'ITEM_MFG', schema: 'ESCCHKSHT' })
export class ITEM_MFG {
  @PrimaryGeneratedColumn()
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
  NUSERCREATE: number;

  @Column()
  DDATECREATE: Date;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;

  @ManyToOne(() => UserSection, (u) => u.ITEM_MFG)
  @JoinColumn({ name: 'NSEC_ID', referencedColumnName: 'SEC_ID' })
  USER_SECTION: UserSection;

  @ManyToOne(() => ITEM_STATUS, (i) => i.ITEM_MFG)
  @JoinColumn({ name: 'NSTATUS', referencedColumnName: 'NSTATUS' })
  ITEM_STATUS: ITEM_STATUS;

  @ManyToOne(() => ITEM_MFG_TYPE, (i) => i.ITEM_MFG)
  @JoinColumn({ name: 'NTYPE', referencedColumnName: 'NTYPE' })
  ITEM_MFG_TYPE: ITEM_MFG_TYPE;

  @OneToMany(() => ITEM_MFG_LIST, (i) => i.ITEM)
  ITEM_LIST: ITEM_MFG_LIST[];

  @OneToMany(() => ITEM_SHEET_MFG, (s) => s.ITEM)
  SHEET: ITEM_SHEET_MFG[];

  @ManyToOne(() => BLOCK_MASTER, (b) => b.ITEM_MFG)
  @JoinColumn({ name: 'NBLOCKID', referencedColumnName: 'NID' })
  BLOCK_MASTER: BLOCK_MASTER;
}
