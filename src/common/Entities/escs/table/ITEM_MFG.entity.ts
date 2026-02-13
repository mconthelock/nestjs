import { UserSection } from 'src/escs/user_section/entities/user_section.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ITEM_STATUS } from './ITEM_STATUS.entity';
import { ITEM_MFG_TYPE } from './ITEM_MFG_TYPE.entity';

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

  @ManyToOne(() => UserSection, (u) => u.ITEM_MFG)
  @JoinColumn({ name: 'NSEC_ID', referencedColumnName: 'SEC_ID' })
  USER_SECTION: UserSection;

  @ManyToOne(() => ITEM_STATUS, (i) => i.ITEM_MFG)
  @JoinColumn({ name: 'NSTATUS', referencedColumnName: 'NSTATUS' })
  ITEM_STATUS: ITEM_STATUS;

  @ManyToOne(() => ITEM_MFG_TYPE, (i) => i.ITEM_MFG)
  @JoinColumn({ name: 'NTYPE', referencedColumnName: 'NTYPE' })
  ITEM_MFG_TYPE: ITEM_MFG_TYPE;
}
