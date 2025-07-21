import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_INQUIRY_REASON')
export class Reason {
  @PrimaryColumn()
  REASON_ID: string;

  @Column()
  REASON_CODE: string;

  @Column()
  REASON_DESC: string;
}
