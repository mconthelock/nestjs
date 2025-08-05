import {
  Entity,
  PrimaryColumn,
  JoinColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';
import { InquiryDetail } from '../../inquiry-detail/entities/inquiry-detail.entity';

@Entity('SP_INQUIRY_GROUP')
export class InquiryGroup {
  @PrimaryColumn()
  INQG_ID: number;

  @Column()
  INQ_ID: number;

  @Column()
  INQG_GROUP: number;

  @Column()
  INQG_REV: string;

  @Column()
  INQG_ASG: string;

  @Column()
  INQG_DES: string;

  @Column()
  INQG_CHK: string;

  @Column()
  INQG_CLASS: string;

  @Column()
  INQG_ASG_DATE: Date;

  @Column()
  INQG_DES_DATE: Date;

  @Column()
  INQG_CHK_DATE: Date;

  @Column()
  INQG_DES_REASON: string;

  @Column()
  INQG_STATUS: number;

  @Column()
  INQG_LATEST: number;

  @Column()
  IS_MAIL: string;

  @ManyToOne(() => Inquiry, (inquiry) => inquiry.inqgroup)
  @JoinColumn({ name: 'INQ_ID', referencedColumnName: 'INQ_ID' })
  inqs: Inquiry;

  @OneToMany(() => InquiryDetail, (detail) => detail.inqgroup)
  @JoinColumn({ name: 'INQG_ID', referencedColumnName: 'INQG_GROUP' })
  details: InquiryDetail[];
}
