import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({
  name: 'USERS_SECTION',
  schema: 'ESCCHKSHT',
})
export class UserSection {
  @PrimaryColumn()
  SEC_ID: number;

  @Column()
  SEC_NAME: string;

  @Column({ default: 1 })
  SEC_STATUS: number;

  @Column()
  INCHARGE: string;

  @Column()
  SSECCODE: string;

  @OneToMany(() => ITEM_MFG, (i) => i.USER_SECTION)
  ITEM_MFG: ITEM_MFG[];
}
