import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_DELIVERY_TERM')
export class Term {
  @PrimaryColumn()
  TERM_ID: string;

  @Column()
  TERM_DESC: string;

  @Column()
  TERM_STATUS: string;

  @OneToMany(() => Inquiry, (inq) => inq.term)
  @JoinColumn({
    name: 'TERM_ID',
    referencedColumnName: 'INQ_DELIVERY_TERM',
  })
  inqs: Inquiry;
}
