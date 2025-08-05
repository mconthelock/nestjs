import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';

@Entity('SP_SHIPMENT')
export class Shipment {
  @PrimaryColumn()
  SHIPMENT_ID: number;

  @Column()
  SHIPMENT_VALUE: number;

  @Column()
  SHIPMENT_DESC: string;

  @Column()
  SHIPMENT_STATUS: string;

  @OneToMany(() => Inquiry, (inq) => inq.shipment)
  @JoinColumn({
    name: 'SHIPMENT_ID',
    referencedColumnName: 'INQ_SHIPMENT',
  })
  inqs: Inquiry;
}
