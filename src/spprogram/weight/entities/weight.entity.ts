import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_WEIGHT')
export class Weight {
  @PrimaryColumn()
  INQ_ID: number;

  @PrimaryColumn()
  SEQ_WEIGHT: number;

  @Column()
  NO_WEIGHT: number;

  @Column()
  PACKAGE_TYPE: string;

  @Column()
  NET_WEIGHT: number;

  @Column()
  GROSS_WEIGHT: number;

  @Column()
  WIDTH_WEIGHT: number;

  @Column()
  LENGTH_WEIGHT: number;

  @Column()
  HEIGHT_WEIGHT: number;

  @Column('decimal', { precision: 10, scale: 2 })
  VOLUMN_WEIGHT: number;

  @Column()
  ROUND_WEIGHT: number;

  @ManyToOne(() => Inquiry, (inq) => inq.weight)
  @JoinColumn({ name: 'INQ_ID', referencedColumnName: 'INQ_ID' })
  inqs: Inquiry;
}
