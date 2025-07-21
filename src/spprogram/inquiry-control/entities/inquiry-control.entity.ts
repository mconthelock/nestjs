import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('SP_INQUIRY_CONTROL')
export class InquiryControl {
  @PrimaryColumn()
  CNT_PREFIX: string;

  @PrimaryColumn()
  CNT_AGENT: string;

  @PrimaryColumn()
  CNT_TRADER: string;

  @Column()
  CNT_QUOTATION: string;

  @Column()
  CNT_TERM: string;

  @Column()
  CNT_WEIGHT: string;

  @Column()
  CNT_METHOD: string;
}
