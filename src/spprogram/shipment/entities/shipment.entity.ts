import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_SHIPMENT')
export class Shipment {
  @PrimaryColumn()
  SHIPMENT_ID: string;

  @Column()
  SHIPMENT_VALUE: string;

  @Column()
  SHIPMENT_DESC: string;

  @Column()
  SHIPMENT_STATUS: string;
}
