import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { QainsForm } from '../qains_form/entities/qains_form.entity';

@Entity({
  name: 'USERS_SECTION',
  schema: 'ESCCHKSHT'
})
export class UserSection {
  @PrimaryColumn()
  SEC_ID: number;

  @Column()
  SEC_NAME: string;

  @Column({default: 1})
  SEC_STATUS: number;

  @Column()
  INCHARGE: string;

  @Column()
  SSECCODE: string;

  @OneToOne(() => QainsForm, (q) => q.QA_INCHARGE_SECTION_INFO)
  QAINS: QainsForm;
}
