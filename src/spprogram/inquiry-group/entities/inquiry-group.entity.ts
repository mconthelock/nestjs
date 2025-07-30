import { Entity, PrimaryColumn, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_INQUIRY_GROUP')
export class InquiryGroup {
  @PrimaryColumn()
  INQG_ID: string;

  @Column()
  INQ_ID: string;

  @Column()
  INQG_GROUP: string;

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
  INQG_ASG_DATE: string;

  @Column()
  INQG_DES_DATE: string;

  @Column()
  INQG_CHK_DATE: string;

  @Column()
  INQG_DES_REASON: string;

  @Column()
  INQG_STATUS: string;

  @Column()
  INQG_LATEST: string;

  @Column()
  IS_MAIL: string;

  @ManyToOne(() => Inquiry, (inquiry) => inquiry.inqgroup)
  @JoinColumn({ name: 'INQ_ID', referencedColumnName: 'INQ_ID' })
  inqs: Inquiry;
}
