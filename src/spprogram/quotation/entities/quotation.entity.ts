import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_QUOTATION')
export class Quotation {
  @PrimaryGeneratedColumn()
  QUO_ID: number;

  @Column()
  QUO_INQ: number;

  @Column()
  QUO_REV: string;

  @Column()
  QUO_DATE: Date;

  @Column()
  QUO_VALIDITY: Date;

  @Column()
  QUO_PIC: string;

  @Column()
  QUO_SEA_FREIGHT: number;

  @Column()
  QUO_SEA_VOLUMN: number;

  @Column()
  QUO_SEA_TOTAL: number;

  @Column()
  QUO_AIR_FREIGHT: number;

  @Column()
  QUO_AIR_VOLUMN: number;

  @Column()
  QUO_AIR_TOTAL: number;

  @Column()
  QUO_COURIER_FREIGHT: number;

  @Column()
  QUO_COURIER_VOLUMN: number;

  @Column()
  QUO_COURIER_TOTAL: number;

  @Column()
  QUO_NOTE: string;

  @Column({ default: 1 })
  QUO_LATEST: number;

  @OneToOne(() => Inquiry, (quo) => quo.quotation)
  @JoinColumn({ name: 'QUO_INQ', referencedColumnName: 'INQ_ID' })
  inqs: Inquiry;
}
