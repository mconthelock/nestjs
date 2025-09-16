import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_INQUIRY_TIMELINE')
export class Timeline {
  @PrimaryColumn()
  INQ_NO: string;

  @PrimaryColumn()
  INQ_REV: string;

  @Column()
  MAR_USER: string;

  @Column()
  MAR_SEND: Date;

  @Column()
  SG_USER: string;

  @Column()
  SG_READ: Date;

  @Column()
  SG_CONFIIRM: Date;

  @Column()
  SE_USER: string;

  @Column()
  SE_READ: Date;

  @Column()
  SE_CONFIIRM: Date;

  @Column()
  DE_READ: Date;

  @Column()
  DE_CONFIRM: Date;

  @Column()
  BM_COFIRM: Date;

  @Column()
  PKC_USER: string;

  @Column()
  PKC_READ: Date;

  @Column()
  PKC_CONFIRM: Date;

  @Column()
  FIN_USER: string;

  @Column()
  FIN_READ: Date;

  @Column()
  FIN_CONFIRM: Date;

  @Column()
  FCK_USER: string;

  @Column()
  FCK_READ: Date;

  @Column()
  FCK_CONFIRM: Date;

  @Column()
  FMN_USER: string;

  @Column()
  FMN_READ: Date;

  @Column()
  FMN_CONFIRM: Date;

  @Column()
  QT_USER: string;

  @Column()
  QT_READ: Date;

  @Column()
  QT_CONFIRM: Date;

  @Column()
  BYPASS_SE: string;

  @Column()
  BYPASS_DE: string;

  @Column()
  SALE_CLASS: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  @OneToOne(() => Inquiry, (inqs) => inqs.timeline)
  @JoinColumn({ name: 'INQ_NO', referencedColumnName: 'INQ_NO' })
  @JoinColumn({ name: 'INQ_REV', referencedColumnName: 'INQ_REV' })
  inqs: Inquiry;
}
