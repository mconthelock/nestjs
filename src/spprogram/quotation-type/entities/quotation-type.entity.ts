import { Entity, PrimaryColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { Ratio } from '../../ratio/entities/ratio.entity';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_QUOTATION_TYPE')
export class QuotationType {
  @PrimaryColumn()
  QUOTYPE_ID: string;

  @Column()
  QUOTYPE_DESC: string;

  @Column()
  QUOTYPE_STATUS: number;

  @Column()
  QUOTYPE_CUR: string;

  @OneToMany(() => Ratio, (rate) => rate.quoText)
  @JoinColumn({ name: 'QUOTYPE_ID', referencedColumnName: 'QUOTATION' })
  ratio: QuotationType;

  @OneToMany(() => Inquiry, (inq) => inq.quotype)
  @JoinColumn({
    name: 'QUOTYPE_ID',
    referencedColumnName: 'INQ_QUOTATION_TYPE',
  })
  inqs: Inquiry;
}
