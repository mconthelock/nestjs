import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('BUS_LINE')
export class Busline {
  @PrimaryColumn()
  BUSID: number;

  @Column()
  BUSNAME: string;

  @Column()
  BUSTYPE: string;

  @Column()
  BUSSTATUS: string;

  @Column()
  BUSSEAT: number;

  @Column()
  IS_CHONBURI: string;
}
